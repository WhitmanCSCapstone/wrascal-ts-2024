import { Controller, Inject, Injectable } from "@tsed/di";
import { Description, Example, Post, Returns, Schema, Summary } from "@tsed/schema";
import { POSTGRES_DATA_SOURCE } from "../../../datasources/PostgresDatasource";
import { DataSource } from "typeorm";
import { BodyParams } from "@tsed/platform-params";
import { Constant } from "../../../datasources/entities/Constant";
import { BadRequest } from "@tsed/exceptions";
import {
  LigandAdvanceSearchResult,
  LigandAdvanceSearchResultSchema,
  LigandSearchResultModel,
  LigandSearchResultSchema
} from "../../../models/LigandSearchResultModel";
import {
  AdvanceSearchRequestExample,
  AdvanceSearchRequestModel,
  AdvanceSearchRequestSchema
} from "../../../models/AdvanceSearchRequestModel";
import ArrayUtils from "../../../utils/ArrayUtils";
import { ConstantRequestExample, ConstantRequestModel, ConstantRequestSchema } from "../../../models/ConstantRequestModel";
import { ConstantResultRawModel, ConstantResultRawModelSchema } from "../../../models/ConstantResultModel";

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
  @Returns(200, LigandSearchResultModel).Description("Ligand search result").Schema(LigandSearchResultSchema)
  @Summary("Perform a search using ligand")
  @Description("Perform a search using ligand, returns an array of search result. Can have multiple ligand keywords at same time.")
  async searchByLigand(@BodyParams() @Example(["EDTA"]) ligands: string[]): Promise<LigandSearchResultModel[]> {
    if (ligands.length === 0) throw new BadRequest("POST Body is empty");

    const ligandsStr = ligands.join("%");

    return await this.dataSource
      .getRepository(Constant)
      .createQueryBuilder()
      .distinct(true)
      .select(["central_element", "ligand_id", "metal_id"])
      .addSelect("ligands.name", "name")
      .addSelect("ligands.charge", "ligand_charge")
      .addSelect("metals.charge", "metal_charge")
      .innerJoin("ligands", "ligands", "ligand_id = ligands.id")
      .innerJoin("metals", "metals", "metal_id = metals.id")
      .where(`name iLike '%${ligandsStr}%'`)
      .getRawMany<LigandSearchResultModel>();
  }

  @Post("/search/advance")
  @Returns(400).Description("Ligands field should have at least 1 element")
  @Returns(200, LigandAdvanceSearchResult).Description("Advance search result").Schema(LigandAdvanceSearchResultSchema)
  @Summary("Perform a advance search using multiple fields")
  @Description("Perform a advance search using multiple fields, returns an array of search result.")
  async advanceSearch(
    @BodyParams()
    @Schema(AdvanceSearchRequestSchema)
    @Example(AdvanceSearchRequestExample)
    searchReq: AdvanceSearchRequestModel
  ): Promise<LigandAdvanceSearchResult[]> {
    if (!ArrayUtils.any(searchReq.ligands)) throw new BadRequest("Ligands field should have at least 1 element");

    // eslint-disable-next-line
    const ligandsStr = searchReq.ligands!.join("%");
    let query = this.dataSource
      .getRepository(Constant)
      .createQueryBuilder()
      .distinct(true)
      .select(["name", "molecular_formula", "categories", "central_element", "ligand_id", "metal_id"])
      .addSelect("ligands.charge", "ligand_charge")
      .addSelect("metals.charge", "metal_charge")
      .innerJoin("ligands", "ligands", "ligand_id = ligands.id")
      .innerJoin("metals", "metals", "metal_id = metals.id")
      .where(`name iLike '%${ligandsStr}%'`);

    if (ArrayUtils.any(searchReq.metals)) {
      // eslint-disable-next-line
      const metalStr = searchReq.metals!.map((m) => `'${m}'`).join(",");
      query = query.andWhere(`central_element IN (${metalStr})`);
    }

    if (ArrayUtils.any(searchReq.ligandCharges)) {
      // eslint-disable-next-line
      const ligandChargesStr = searchReq.ligandCharges!.join(",");
      query = query.andWhere(`ligands.charge IN (${ligandChargesStr})`);
    }

    if (ArrayUtils.any(searchReq.metalCharges)) {
      // eslint-disable-next-line
      const metalChargesStr = searchReq.metalCharges!.join(",");
      query = query.andWhere(`metals.charge IN (${metalChargesStr})`);
    }

    if (ArrayUtils.any(searchReq.categories)) {
      // eslint-disable-next-line
      const categoryStr = searchReq.categories!.map((m) => `'${m}'`).join(",");
      query = query.andWhere(`categories @> ARRAY[${categoryStr}]`);
    }

    if (ArrayUtils.any(searchReq.chemicals)) {
      // eslint-disable-next-line
      const chemicalStr = searchReq.chemicals!.join(",");
      query = query.andWhere(`(molecular_formula).atom_counts @> ARRAY[${chemicalStr}]::molecularformulaentry[]`);
    }

    return await query.getRawMany<LigandAdvanceSearchResult>();
  }

  @Post("/constants")
  @Returns(200, ConstantResultRawModel).Description("Constants result").Schema(ConstantResultRawModelSchema)
  @Summary("Get details based on ids of metal and ligand")
  @Description("Get details based on ids of metal and ligand, returns an array of results.")
  async getConstants(
    @BodyParams()
    @Schema(ConstantRequestSchema)
    @Example(ConstantRequestExample)
    constReq: ConstantRequestModel
  ): Promise<ConstantResultRawModel[]> {
    const withQuery = this.dataSource
      .getRepository(Constant)
      .createQueryBuilder()
      .select([
        "value",
        "significant_figures",
        "equilibrium_expression_id",
        "conditions_id",
        "uncertainty_id",
        "footnote_id",
        "ligand_id",
        "metal_id"
      ])
      .where(`ligand_id = ${constReq.ligandId}`)
      .andWhere(`metal_id = ${constReq.metalId}`)
      .getQuery();

    /*
    const result: ConstantResultModel[] = [];

    resultRaw.forEach(r => {
      result.push(ConstantResultModel.fromRaw(r));
    });
    */

    return await this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(withQuery, "table_ids")
      .select([
        "name",
        "molecular_formula",
        "value",
        "significant_figures",
        "categories",
        "central_element",
        "constant_kind",
        "temperature",
        "temperature_varies",
        "ionic_strength",
        "expression_string",
        "products",
        "reactants",
        "direction",
        "magnitude",
        "notes"
      ])
      .addSelect("ligands.charge", "ligand_charge")
      .addSelect("(form).protonation", "protonation")
      .addSelect("metals.charge", "metal_charge")
      .from("table_ids", "table_ids")
      .leftJoin("ligands", "ligands", "ligands.id = table_ids.ligand_id")
      .leftJoin("metals", "metals", "metals.id = table_ids.metal_id")
      .leftJoin("equilibrium_expressions", "equilibrium_expressions", "equilibrium_expressions.id = table_ids.equilibrium_expression_id")
      .leftJoin("uncertainties", "uncertainties", "uncertainties.id = table_ids.uncertainty_id")
      .leftJoin("footnotes", "footnotes", "footnotes.id = table_ids.footnote_id")
      .leftJoin("conditions", "conditions", "conditions.id = table_ids.conditions_id")
      .getRawMany<ConstantResultRawModel>();
  }
}
