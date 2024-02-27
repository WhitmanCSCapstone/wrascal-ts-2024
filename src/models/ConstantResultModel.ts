import { MolecularFormula, MolecularFormulaSchema } from "../datasources/entities/Ligand";
import { ExpressionEntry, ExpressionEntrySchema, toExpressionArray } from "../datasources/entities/EquilibriumExpression";
import { Note, NoteSchema, toNoteArray } from "../datasources/entities/Footnote";
import { array, boolean, number, object, string } from "@tsed/schema";

export class UncertaintyModel {
  id: number;
  direction: string;
  magnitude: number;
}

export class ConstantResultModelBase {
  name: string;
  ligand_charge: number;
  metal_charge: number;
  value: number;
  significant_figures: number;
  categories: string[];
  central_element: string;
  constant_kind: string;
  temperature: number;
  temperature_varies: boolean;
  ionic_strength: number;
  expression_string: string;
  direction?: string;
  magnitude?: number;
  protonation: number;
}

export class ConstantResultRawModel extends ConstantResultModelBase {
  molecular_formula: string;
  products: string;
  reactants: string;
  notes: string;
  legacy_identifier: string;
}

export const ConstantResultRawModelSchema = object({
  name: string(),
  ligand_charge: number(),
  metal_charge: number(),
  value: number(),
  significant_figures: number(),
  categories: array().items(string()),
  central_element: string(),
  constant_kind: string(),
  temperature: number(),
  temperature_varies: boolean(),
  ionic_strength: number(),
  expression_string: string(),
  direction: string(),
  magnitude: number(),
  protonation: number(),
  molecular_formula: string(),
  products: string(),
  reactants: string(),
  notes: string(),
  legacy_identifier: string()
});

export const ConstantResultModelSchema = object({
  name: string(),
  ligand_charge: number(),
  metal_charge: number(),
  value: number(),
  significant_figures: number(),
  categories: array().items(string()),
  central_element: string(),
  constant_kind: string(),
  temperature: number(),
  temperature_varies: boolean(),
  ionic_strength: number(),
  expression_string: string(),
  direction: string(),
  magnitude: number(),
  protonation: number(),
  molecular_formula: MolecularFormulaSchema,
  products: array().items(ExpressionEntrySchema),
  reactants: array().items(ExpressionEntrySchema),
  notes: array().items(NoteSchema)
});

export class ConstantResultModel extends ConstantResultModelBase {
  molecular_formula: MolecularFormula;
  products: ExpressionEntry[];
  reactants: ExpressionEntry[];
  notes: Note[];
  legacy_identifier: string;

  public static fromRaw(raw: ConstantResultRawModel): ConstantResultModel {
    const result = new ConstantResultModel();

    result.name = raw.name;
    result.ligand_charge = raw.ligand_charge;
    result.metal_charge = raw.metal_charge;
    result.value = raw.value;
    result.significant_figures = raw.significant_figures;
    result.categories = raw.categories;
    result.central_element = raw.central_element;
    result.constant_kind = raw.constant_kind;
    result.temperature = raw.temperature;
    result.temperature_varies = raw.temperature_varies;
    result.ionic_strength = raw.ionic_strength;
    result.expression_string = raw.expression_string;
    result.direction = raw.direction;
    result.magnitude = raw.magnitude;
    result.protonation = raw.protonation;

    result.molecular_formula = MolecularFormula.fromStr(raw.molecular_formula);
    result.products = toExpressionArray(raw.products);
    result.reactants = toExpressionArray(raw.reactants);
    result.notes = toNoteArray(raw.notes);
    result.legacy_identifier = raw.legacy_identifier;

    return result;
  }
}
