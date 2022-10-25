import { Controller, Inject, Injectable } from "@tsed/di";
import {Description, Example, Get, Post, Returns, Schema, Summary} from "@tsed/schema";
import { POSTGRES_DATA_SOURCE } from "../../../datasources/PostgresDatasource";
import { DataSource } from "typeorm";
import { BodyParams } from "@tsed/platform-params";
import { Constant } from "../../../datasources/entities/Constant";
import { BadRequest } from "@tsed/exceptions";
import { LigandSearchResult, LigandSearchResultSchema } from "../../../models/LigandSearchResult";
import {AdvanceSearchRequestModel, AdvanceSearchRequestModelSchema} from "../../../models/AdvanceSearchRequestModel";

@Injectable()
@Controller("/db")
export class SearchController {
  @Inject(POSTGRES_DATA_SOURCE)
  protected dataSource: DataSource;

  $onInit() {
    if (this.dataSource.isInitialized) {
      console.log("POSTGREDB DATASOURCE INIT");
    }
  }

  @Post("/search/ligand")
  @Returns(400).Description("POST Body is empty")
  @Returns(200, LigandSearchResult).Description("Ligand search result").Schema(LigandSearchResultSchema)
  @Summary("Perform a search using ligand.")
  @Description("Perform a search using ligand, returns an array of search result. Can have multiple ligand keywords at same time.")
  async searchByLigand(@BodyParams() @Example(["EDTA"]) ligands: string[]): Promise<LigandSearchResult[]> {
    if (ligands.length === 0) throw new BadRequest("POST Body is empty.");

    const ligandsStr = ligands.join("%");

    return await this.dataSource
      .getRepository(Constant)
      .createQueryBuilder()
      .select(["central_element", "ligand_id", "metal_id"])
      .addSelect("ligands.name", "name")
      .addSelect("ligands.charge", "ligand_charge")
      .addSelect("metals.charge", "metal_charge")
      .innerJoin("ligands", "ligands", "ligand_id = ligands.id")
      .innerJoin("metals", "metals", "metal_id = metals.id")
      .where(`name iLike '%${ligandsStr}%'`)
      .getRawMany<LigandSearchResult>();
  }

  @Post("/search/advance")
  advanceSearch(@BodyParams() @Schema(AdvanceSearchRequestModelSchema) searchReq: AdvanceSearchRequestModel): Promise<string> {
    return "";
  }

  @Get("/constants")
  getConstants() {
    return "";
  }
}
