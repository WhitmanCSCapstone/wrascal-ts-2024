import { number, object, string, boolean } from "@tsed/schema";
import { Element, MolecularFormula, LigandForm } from "../datasources/entities/Ligand";
import { ConstantKind } from "src/datasources/entities/Condition";
import { EquilibriumExpression, ExpressionEntry } from "src/datasources/entities/EquilibriumExpression";


// work in progress! work out issues with things like elements and stuff
// writerequestmodel is a model of all the potential data that might come in from the user.
// needs to be pared down to multiple, more managable pieces.
// export class WriteRequestModel {
//     metal_id!: number;
//     metal_central_element?: string;
//     metal_formula_string?: string;
//     metal_charge?: number;
//     ligand_id!: number;
//     ligand_name?: string;
//     ligand_mol_formula?: string;
//     ligand_charge?: string;
//     ligand_form?: string;
//     categories?: string;
//     eq_id!: number;
//     eq_expression_string?: string;
//     eq_products?: string;
//     eq_reactants?: string;
//     eq_value?: number;
//     eq_significant_figures?: number;
//     conditions_id!: number;
//     conditions_constant_kind?: string;
//     conditions_temperature?: number;
//     conditions_temperature_varies?: boolean;
//     conditions_ionic_strength?: number;
    
//     // c
//     constructor(
//         metal_id: number,
//         metal_central_element: string,
//         metal_formula_string: string,
//         metal_charge: number,
//         ligand_id: number,
//         ligand_name: string,
//         ligand_mol_formula: string,
//         ligand_charge: string,
//         ligand_form: string,
//         categories: string,
//         eq_id: number,
//         eq_expression_string: string,
//         eq_products: string,
//         eq_reactants: string,
//         eq_value: number,
//         eq_significant_figures: number,
//         conditions_id: number,
//         conditions_constant_kind: string,
//         conditions_temperature: number,
//         conditions_temperature_varies: boolean,
//         conditions_ionic_strength: number,
//     ) {
//         this.metal_id = metal_id
//         this.metal_central_element = metal_central_element,
//         this.metal_formula_string = metal_central_element,
//         this.metal_charge = metal_charge,
//         this.ligand_id = ligand_id,
//         this.ligand_name = ligand_name,
//         this.ligand_mol_formula = ligand_mol_formula,
//         this.ligand_charge = ligand_charge,
//         this.ligand_form = ligand_form,
//         this.categories = categories,
//         this.eq_id = eq_id,
//         this.eq_expression_string = eq_expression_string,
//         this.eq_products = eq_products,
//         this.eq_reactants = eq_reactants,
//         this.eq_value = eq_value,
//         this.eq_significant_figures = eq_significant_figures,
//         this.conditions_id = conditions_id,
//         this.conditions_constant_kind = conditions_constant_kind,
//         this.conditions_temperature = conditions_temperature,
//         this.conditions_temperature_varies = conditions_temperature_varies
//         this.conditions_ionic_strength = conditions_ionic_strength;
//     }
// }

// export const WriteRequestSchema = object({
//     metal_id: number(),
//     metal_central_element: string().description(""),
//     metal_formula_string: string().description(""),
//     metal_charge: number(),
//     ligand_id: number(),
//     ligand_name: string().description(""),
//     ligand_mol_formula: string().description(""),
//     ligand_charge: string().description(""),
//     ligand_form: string().description(""),
//     categories: string().description(""),
//     eq_id: number(),
//     eq_expression_string: string().description(""),
//     eq_products: string().description(""),
//     eq_reactants: string().description(""),
//     eq_value: number(),
//     eq_significant_figures: number(),
//     conditions_id: number(),
//     conditions_constant_kind: string(),
//     conditions_temperature: number(),
//     conditions_temperature_varies: boolean(),
//     conditions_ionic_strength: number()
// });

// export class WriteRequestExample {
//     metal_id!: number;
//     metal_central_element?: Element;
//     metal_formula_string?: string;
//     metal_charge?: number;

//     constructor(
//         metal_id: number,
//         metal_central_element: Element,
//         metal_formula_string: string,
//         metal_charge: number
//     ) {
//         this.metal_id = metal_id
//         this.metal_central_element = Element[metal_central_element as keyof typeof Element],
//         this.metal_formula_string = metal_central_element,
//         this.metal_charge = metal_charge
//     }
// }

export interface conditionsData {
    constant_kind?: ConstantKind;
    temperature?: number;
    temperature_varies?: boolean;
    ionic_strength?: number;
}

export interface metalData {
    central_element: string;
    formula_string: string;
    charge: number;
}

export interface ligandData {
    name: string;
    molecular_formula?: MolecularFormula;
    charge?: number;
    form?: LigandForm;
    categories?: string[];

}

export interface equilibriumExpressionData {
    expression_string?: string;
    products?: ExpressionEntry[];
    reactants?: ExpressionEntry[];
}
  
export interface writeRequest {
    metalInfo: metalData;
    ligandInfo: ligandData;
    conditionsInfo: conditionsData;
    equilibriumExpressionInfo: equilibriumExpressionData;
}