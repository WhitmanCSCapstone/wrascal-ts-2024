import {number, object, string} from "@tsed/schema";

export class AdvanceSearchRequestModel{
    ligand: string;
    metal: string;
    category: string;
    ligandCharge: number;
    metalCharge: number;
    chemical: string;

    constructor(ligand: string, metal: string,
                category: string, ligandCharge: number,
                metalCharge: number, chemical: string) {
        this.ligand = ligand;
        this.metal = metal;
        this.category = category;
        this.ligandCharge = ligandCharge;
        this.metalCharge = metalCharge;
        this.chemical = chemical;
    }
}

export const AdvanceSearchRequestModelSchema = object({
    ligand: string().description(""),
    metal: string().description(""),
    category: string().description(""),
    ligandCharge: number().description(""),
    metalCharge: number().description(""),
    chemical: string().description("")
});
