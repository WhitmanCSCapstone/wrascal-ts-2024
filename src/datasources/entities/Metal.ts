import { Column, Entity, PrimaryColumn } from "typeorm";
import { Element } from "./Ligand";

@Entity({ name: "metals" })
export class Metal {
  @PrimaryColumn()
  id!: number;

  @Column({ name: "legacy_string" })
  legacyString?: string;

  @Column("enum", { 
    name: "central_element", 
    enum: Element})
  centralElement!: Element;

  @Column({ name: "formula_string" })
  formulaString!: string;

  @Column()
  charge!: number;
}

// these maybe could be combined, but it might break search - do at your own risk!
@Entity({ name: "metals_user_gen" })
export class Metals_ug {
  @PrimaryColumn()
  id!: number;

  @Column({ name: "legacy_string" })
  legacy_string?: string;

  @Column("enum", { name: "central_element", enum: Element})
  central_element!: Element;

  @Column({ name: "formula_string" })
  formula_string!: string;

  @Column()
  charge!: number;
}
