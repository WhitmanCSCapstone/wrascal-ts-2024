import { Column, Entity, PrimaryColumn } from "typeorm";
import { ColumnCommonOptions } from "typeorm/decorator/options/ColumnCommonOptions";
import { number, object, string } from "@tsed/schema";

export function toExpressionArray(str: string): ExpressionEntry[] {
  const result: ExpressionEntry[] = [];
  const regex = /\((?:[a-zA-Z0-9]+|".+"),\d+\)/g;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [...str.matchAll(regex)].forEach((match, _) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    match.forEach((value, _) => {
      result.push(ExpressionEntry.fromStr(value));
    });
  });

  return result;
}

export default function ExpressionEntryParserConfig(): ColumnCommonOptions {
  return {
    transformer: {
      from(value: string): ExpressionEntry[] {
        return toExpressionArray(value);
      },
      to(value: ExpressionEntry[]): string {
        const parsedArr: string[] = [];

        value.forEach(function (obj) {
          parsedArr.push(ExpressionEntry.toStr(obj));
        });

        return `{${parsedArr.join(",")}}`;
      }
    }
  };
}

export const ExpressionEntrySchema = object({
  species: string(),
  equivalents: number()
});

export class ExpressionEntry {
  species: string;
  equivalents: number;

  constructor(species: string, equivalents: number) {
    this.species = species;
    this.equivalents = equivalents;
  }

  public static fromStr(str: string): ExpressionEntry {
    const [speciesStr, equivalentsStr] = str.substring(1, str.length - 1).split(",");

    const equivalentsNum = +equivalentsStr;
    if (isNaN(equivalentsNum)) throw new TypeError(`invalid amount in record equivalents: [${equivalentsStr}]`);

    return new ExpressionEntry(speciesStr.replace('"', ""), equivalentsNum);
  }

  public static toStr(obj: ExpressionEntry): string {
    if (isNaN(obj.equivalents)) throw new TypeError(`invalid amount in record equivalents`);

    let species = obj.species;

    if (/^[A-Za-z0-9]*$/.test(obj.species)) species = `"${obj.species}"`;

    return `(${species},${obj.equivalents})`;
  }
}

@Entity({ name: "equilibrium_expressions" })
export class EquilibriumExpression {
  @PrimaryColumn()
  id!: number;

  @Column({ name: "expression_string" })
  expression!: string;

  @Column("text", ExpressionEntryParserConfig())
  products!: ExpressionEntry[];

  @Column("text", ExpressionEntryParserConfig())
  reactants!: ExpressionEntry[];

  @Column({ name: "legacy_identifier" })
  legacyIdentifier!: string;
}
