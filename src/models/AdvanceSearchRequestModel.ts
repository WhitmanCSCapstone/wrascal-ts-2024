import { number, object, string } from "@tsed/schema";

export class AdvanceSearchRequestModel {
  ligands?: string[];
  metals?: string[];
  categories?: string[];
  ligandCharges?: number[];
  metalCharges?: number[];
  chemicals?: string[];
  limit?: number;

  constructor(
    ligands: string[],
    metals: string[] = [],
    categories: string[] = [],
    ligandCharges: number[] = [],
    metalCharges: number[] = [],
    chemicals: string[] = [],
    limit: number = 100
  ) {
    this.ligands = ligands;
    this.metals = metals;
    this.categories = categories;
    this.ligandCharges = ligandCharges;
    this.metalCharges = metalCharges;
    this.chemicals = chemicals;
    this.limit = limit;
  }
}

export const AdvanceSearchRequestSchema = object({
  ligands: string().description(""),
  metals: string().description(""),
  categories: string().description(""),
  ligandCharges: number().description(""),
  metalCharges: number().description(""),
  chemicals: string().description(""),
  limit: number().description("")
});

export const AdvanceSearchRequestExample = new AdvanceSearchRequestModel(["EDTA"], ["H"], [], [], [], [], 300);
