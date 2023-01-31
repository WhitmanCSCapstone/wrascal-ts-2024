import { Controller, Inject, Injectable } from "@tsed/di";
import { POSTGRES_DATA_SOURCE } from "../../../datasources/PostgresDatasource";
import { DataSource, In } from "typeorm";
import { MolDataResultModel, MolDataResultModelSchema } from "../../../models/MolDataResultModel";
import { array, Description, Example, Get, Post, Returns, Summary } from "@tsed/schema";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { BadRequest, NotFound } from "@tsed/exceptions";
import { MolData } from "../../../datasources/entities/MolData";
import ArrayUtils from "../../../utils/ArrayUtils";
import MolUtils from "../../../utils/MolUtils";

@Injectable()
@Controller("/mol")
export class MolDataController {
  @Inject(POSTGRES_DATA_SOURCE)
  protected dataSource: DataSource;

  $onInit() {
    if (this.dataSource.isInitialized) {
      console.log("POSTGREDB DATASOURCE INIT");
    }
  }

  @Get("/get/:ligandId")
  @Returns(400).Description("Invalid Ligand Id")
  @Returns(200, MolDataResultModel).Description("The draw code information for the requested ID").Schema(MolDataResultModelSchema)
  @Summary("Fetch all the draw code using a given ligand ID.")
  @Description("Fetch all the draw code using a given ligand ID, returns an array of result.")
  async getMolImage(@PathParams("ligandId") @Example(412) ligandId: number): Promise<MolDataResultModel> {
    if (ligandId <= 0) throw new BadRequest("Invalid Ligand Id.");

    ligandId = MolUtils.getNewLigandMapping(ligandId);

    const queryResult = await this.dataSource.getRepository(MolData).findOneBy({
      id: ligandId
    });

    if (!queryResult) throw new NotFound(`Draw code requested by ID [${ligandId}] is not found.`);

    return MolDataResultModel.fromRaw(queryResult);
  }

  @Post("/get")
  @Returns(400).Description("Invalid Ligand Ids")
  @Returns(200, [MolDataResultModel])
    .Description("The draw code information for the requested ID")
    .Schema(array().items(MolDataResultModelSchema))
  @Summary("Fetch all the draw codes using a given ligand ID.")
  @Description("Fetch all the draw codes using a given ligand ID, returns an array of result.")
  async getMolImages(@BodyParams() @Example([412, 413]) ligandIds: number[]): Promise<MolDataResultModel[]> {
    if (!ArrayUtils.any(ligandIds)) throw new BadRequest("Invalid Ligand Ids.");

    ligandIds = [...new Set(ligandIds)];
    ligandIds = ligandIds.map((val) => MolUtils.getNewLigandMapping(val));

    const queryResult = await this.dataSource.getRepository(MolData).findBy({
      id: In(ligandIds)
    });

    if (!ArrayUtils.any(queryResult)) throw new NotFound(`Draw codes requested by IDs are not found.`);

    const result: MolDataResultModel[] = [];

    for (const mol of queryResult) result.push(MolDataResultModel.fromRaw(mol));

    return result;
  }
}
