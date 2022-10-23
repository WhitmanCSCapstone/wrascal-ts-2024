import {Entity, Column, PrimaryColumn} from "typeorm"
import StringUtils from "../../utils/StringUtils";
import {ColumnCommonOptions} from "typeorm/decorator/options/ColumnCommonOptions";

export default function ExpressionEntryParserConfig(): ColumnCommonOptions{
    return {
        transformer: {
            from(value: string): ExpressionEntry[] {
                const array = StringUtils.parsePgArray(value);
                const result: ExpressionEntry[] = [];

                array.forEach(function (str){
                    result.push(ExpressionEntry.fromStr(str));
                });

                return result;
            },
            to(value: ExpressionEntry[]): string {
                const parsedArr: string[] = [];

                value.forEach(function (obj){
                    parsedArr.push(ExpressionEntry.toStr(obj));
                });

                return `{${parsedArr.join(',')}}`;
            }
        }
    }
}

export class ExpressionEntry{
    species: string;
    equivalents: number;

    constructor(species: string, equivalents: number) {
        this.species = species;
        this.equivalents = equivalents;
    }

    public static fromStr(str: string): ExpressionEntry{
        const [species, equivalents] = StringUtils.parsePgObject(str);

        const equivalentsNum = +equivalents;
        if(isNaN(equivalentsNum))
            throw new TypeError(`invalid amount in record equivalents: [${equivalents}]`);


        return new ExpressionEntry(species.replace('"', ''), equivalentsNum);
    }

    public static toStr(obj: ExpressionEntry): string{
        if(isNaN(obj.equivalents))
            throw new TypeError(`invalid amount in record equivalents`);

        let species = obj.species;

        if(/^[A-Za-z0-9]*$/.test(obj.species))
            species = `"${obj.species}"`;

        return `(${species},${obj.equivalents})`;
    }
}

@Entity({name: "equilibrium_expressions"})
export class EquilibriumExpression {
    @PrimaryColumn()
    id!: number;

    @Column({name: "expression_string"})
    expression!: string;

    @Column("text", ExpressionEntryParserConfig())
    products!: ExpressionEntry[];

    @Column("text", ExpressionEntryParserConfig())
    reactants!: ExpressionEntry[];

    @Column({name: "legacy_identifier"})
    legacyIdentifier!: string;
}
