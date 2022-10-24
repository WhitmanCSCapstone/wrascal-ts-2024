import {Entity, Column, PrimaryColumn} from "typeorm"
import {Element} from "./Ligand";

@Entity({name: "metals"})
export class Metal {
    @PrimaryColumn()
    id!: number;

    @Column({name: "legacy_string"})
    legacyString!: string;

    @Column("enum", {name: "central_element", enum: Element})
    centralElement!: Element;

    @Column({name: "formula_string"})
    formulaString!: string;

    @Column()
    charge!: number;
}