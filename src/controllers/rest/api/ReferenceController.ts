import { Controller, Inject, Injectable } from "@tsed/di";
import { POSTGRES_DATA_SOURCE } from "../../../datasources/PostgresDatasource";
import { DataSource } from "typeorm";
import { PathParams } from "@tsed/platform-params";
import { array, Description, Example, Get, Returns, Summary } from "@tsed/schema";
import { BadRequest } from "@tsed/exceptions";
import { Literature } from "../../../datasources/entities/Literature";
import { ReferenceFetchResultModel, ReferenceFetchResultSchema } from "../../../models/ReferenceFetchResultModel";

@Injectable()
@Controller("/ref")
export class ReferenceController {
  @Inject(POSTGRES_DATA_SOURCE)
  protected dataSource: DataSource;

  $onInit() {
    if (this.dataSource.isInitialized) {
      console.log("POSTGREDB DATASOURCE INIT");
    }
  }

  @Get("/get/:ligandId")
  @Returns(400).Description("Invalid Ligand Id")
  @Returns(200, [ReferenceFetchResultModel])
    .Description("All the references for the given ligand ID.")
    .Schema(array().items(ReferenceFetchResultSchema))
  @Summary("Fetch all the references using a given ligand ID.")
  @Description("Fetch all the references using a given ligand ID, returns an array of result.")
  async getReferences(@PathParams("ligandId") @Example(412) ligandId: number): Promise<ReferenceFetchResultModel[]> {
    if (ligandId <= 0) throw new BadRequest("Invalid Ligand Id.");

    return await this.dataSource
      .getRepository(Literature)
      .createQueryBuilder()
      .distinct()
      .select(`"Literature"."LitAlt_ID"`, "litAltId")
      .addSelect(`"Literature"."LitID"`, "litId")
      .addSelect(`"Literature"."LItRef"`, "reference")
      .addSelect(`"Literature"."LitCode"`, "code")
      .innerJoin("Verkn_ligand_metal_literature", "lit_mapping", `lit_mapping.LitID = "Literature"."LitID"`)
      .innerJoin("ligands_mapping", "ligands_mapping", "ligands_mapping.LigandID = lit_mapping.LigandID")
      .innerJoin("ligands", "ligands", "ligands.name = ligands_mapping.LigandName")
      .where(`ligands.id = ${ligandId}`)
      .getRawMany<ReferenceFetchResultModel>();
  }
}
