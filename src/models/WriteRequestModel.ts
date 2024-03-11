import { number, object, string, boolean } from "@tsed/schema";
import { Element, MolecularFormula, LigandForm } from "../datasources/entities/Ligand";
import { ConstantKind } from "src/datasources/entities/Condition";
import { EquilibriumExpression, ExpressionEntry } from "src/datasources/entities/EquilibriumExpression";
import { uncertaintydirection } from "src/datasources/entities/Uncertainties";
import { Note } from "src/datasources/entities/Footnote";

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

export interface constantsData {
    value?: number;
    significant_figures?: number;
    user_id?: string;
}

export interface uncertaintiesData {
    direction?: uncertaintydirection;
    magnitude?: number;
}

export interface literaturesData {
    litref?: string;
    litcode?: string;
}

export interface footnotesData {
    notes?: Note[];
}
  
export interface writeRequest {
    metalInfo: metalData;
    ligandInfo: ligandData;
    conditionsInfo: conditionsData;
    equilibriumExpressionInfo: equilibriumExpressionData;
    constantsInfo: constantsData;
    uncertaintiesInfo: uncertaintiesData;
    literaturesInfo: literaturesData;
    footnotesInfo: footnotesData;
}