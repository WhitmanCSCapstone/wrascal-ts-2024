import { number, object, string } from "@tsed/schema";

export class LigandSearchResult {
  name!: string;
  ligand_charge!: number;
  metal_charge!: string;
  central_element!: string;
  ligand_id!: number;
  metal_id!: number;
}

export const LigandSearchResultSchema = object({
  name: string().description("Name of the Ligand"),
  ligand_charge: number().description("Ligand's charge"),
  metal_charge: string().description("Metal's charge"),
  central_element: string().description("Central element name"),
  ligand_id: number().description("Unique ID of ligand"),
  metal_id: number().description("Unique ID of metal")
});
