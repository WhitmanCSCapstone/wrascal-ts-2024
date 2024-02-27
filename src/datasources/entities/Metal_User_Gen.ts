import { Column, Entity, PrimaryColumn } from "typeorm";
import { Element } from "./Ligand";

@Entity({ name: "metals_user_gen" })
export class Metal_User_Gen {
  @PrimaryColumn()
  id!: number;

  @Column({ name: "central_element"})
  centralElement!: String;

  @Column({ name: "formula_string" })
  formulaString!: String;

  @Column()
  charge!: number;
}
