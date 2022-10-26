import { number, object, string } from "@tsed/schema";

export class AdvanceSearchRequestModel {
  ligands?: string[];
  metals?: string[];
  categories?: string[];
  ligandCharges?: number[];
  metalCharges?: number[];
  chemicals?: string[];

  constructor(
    ligands: string[],
    metals: string[] = [],
    categories: string[] = [],
    ligandCharges: number[] = [],
    metalCharges: number[] = [],
    chemicals: string[] = []
  ) {
    this.ligands = ligands;
    this.metals = metals;
    this.categories = categories;
    this.ligandCharges = ligandCharges;
    this.metalCharges = metalCharges;
    this.chemicals = chemicals;
  }
}

export const AdvanceSearchRequestSchema = object({
  ligands: string().description(""),
  metals: string().description(""),
  categories: string().description(""),
  ligandCharges: number().description(""),
  metalCharges: number().description(""),
  chemicals: string().description("")
});

export const AdvanceSearchRequestExample = new AdvanceSearchRequestModel(["EDTA"], ["H"]);
