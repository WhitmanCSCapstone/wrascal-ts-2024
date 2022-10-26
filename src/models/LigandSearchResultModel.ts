import { array, number, object, string } from "@tsed/schema";

export class LigandSearchResultModel {
  name!: string;
  ligand_charge!: number;
  metal_charge!: string;
  central_element!: string;
  ligand_id!: number;
  metal_id!: number;
}

export class LigandAdvanceSearchResult extends LigandSearchResultModel {
  molecular_formula!: string;
  categories!: string[];
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
  molecular_formula: string().description("Formula of the molecular"),
  categories: array().type(string).description("Categories")
});
