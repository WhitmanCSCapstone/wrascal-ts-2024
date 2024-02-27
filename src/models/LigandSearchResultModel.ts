import { array, number, object, string } from "@tsed/schema";
import { MolecularFormula, MolecularFormulaSchema } from "../datasources/entities/Ligand";

export class LigandSearchResultModel {
  name!: string;
  ligand_charge!: number;
  metal_charge!: string;
  central_element!: string;
  ligand_id!: number;
  metal_id!: number;
}

export class LigandAdvanceSearchRawResult extends LigandSearchResultModel {
  molecular_formula!: string;
  categories!: string[];
}

export class LigandAdvanceSearchResultModel extends LigandSearchResultModel {
  molecular_formula: MolecularFormula;
  categories!: string[];

  public static fromRaw(raw: LigandAdvanceSearchRawResult): LigandAdvanceSearchResultModel {
    const result = new LigandAdvanceSearchResultModel();

    result.name = raw.name;
    result.ligand_charge = raw.ligand_charge;
    result.metal_charge = raw.metal_charge;
    result.central_element = raw.central_element;
    result.ligand_id = raw.ligand_id;
    result.metal_id = raw.metal_id;
    result.categories = raw.categories;
    result.molecular_formula = MolecularFormula.fromStr(raw.molecular_formula);

    return result;
  }
}

export const LigandSearchResultSchema = object({
  name: string().description("Name of the Ligand"),
  ligand_charge: number().description("Ligand's charge"),
  metal_charge: string().description("Metal's charge"),
  central_element: string().description("Central element name"),
  ligand_id: number().description("Unique ID of ligand"),
  metal_id: number().description("Unique ID of metal")
});

export const LigandAdvanceSearchResultSchema = object({
  name: string().description("Name of the Ligand"),
  ligand_charge: number().description("Ligand's charge"),
  metal_charge: string().description("Metal's charge"),
  central_element: string().description("Central element name"),
  ligand_id: number().description("Unique ID of ligand"),
  metal_id: number().description("Unique ID of metal"),
  molecular_formula: MolecularFormulaSchema.description("Formula of the molecular"),
  categories: array().items(string()).description("Categories")
});
