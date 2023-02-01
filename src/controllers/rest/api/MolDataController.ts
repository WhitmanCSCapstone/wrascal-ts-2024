import { Controller, Inject, Injectable } from "@tsed/di";
import { POSTGRES_DATA_SOURCE } from "../../../datasources/PostgresDatasource";
import { DataSource } from "typeorm";
import { MolDataRawResultModel, MolDataResultModelSchema } from "../../../models/MolDataResultModel";
import { array, Description, Example, Get, Post, Returns, Summary } from "@tsed/schema";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { BadRequest, NotFound } from "@tsed/exceptions";
import { MolData } from "../../../datasources/entities/MolData";
import ArrayUtils from "../../../utils/ArrayUtils";

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
  @Returns(200, MolDataRawResultModel).Description("The draw code information for the requested ID").Schema(MolDataResultModelSchema)
  @Summary("Fetch all the draw code using a given ligand ID.")
  @Description("Fetch all the draw code using a given ligand ID, returns an array of result.")
  async getMolImage(@PathParams("ligandId") @Example(412) ligandId: number): Promise<MolDataRawResultModel> {
    if (ligandId <= 0) throw new BadRequest("Invalid Ligand Id.");

    const result = await this.getDrawCodes([ligandId]);

    if (!ArrayUtils.any(result)) throw new NotFound("Request resource not found.");

    return result[0];
  }

  @Post("/get")
  @Returns(400).Description("Invalid Ligand Ids")
  @Returns(200, [MolDataRawResultModel])
    .Description("The draw code information for the requested ID")
    .Schema(array().items(MolDataResultModelSchema))
  @Summary("Fetch all the draw codes using a given ligand ID.")
  @Description("Fetch all the draw codes using a given ligand ID, returns an array of result.")
  async getMolImages(@BodyParams() @Example([412, 3559, 3560, 3561, 3562]) ligandIds: number[]): Promise<MolDataRawResultModel[]> {
    if (!ArrayUtils.any(ligandIds)) throw new BadRequest("Invalid Ligand Ids.");

    ligandIds = [...new Set(ligandIds)];

    return await this.getDrawCodes(ligandIds);
  }

  private async getDrawCodes(ids: number[]): Promise<MolDataRawResultModel[]> {
    const queryResult = await this.dataSource
      .getRepository(MolData)
      .createQueryBuilder()
      .select(`"MolData"."MoleculeID"`, "molId")
      .addSelect("ligands.name", "name")
      .addSelect("ligands.id", "id")
      .addSelect(`"MolData"."MolDrawCode"`, "drawCode")
      .innerJoin("ligands", "ligands", `ligands.name = "MolData"."name"`)
      .where(`ligands.id IN (${ids.join(",")})`)
      .getRawMany<MolDataRawResultModel>();

    if (!ArrayUtils.any(queryResult)) return [];

    return queryResult.map((val) => MolDataRawResultModel.decode(val));
  }
}
