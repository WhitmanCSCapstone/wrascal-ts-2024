import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Ligand } from "./Ligand";
import { Metal } from "./Metal";

@Entity({ name: "constants" })
export class Constant {
  @PrimaryColumn()
  value!: number;

  @Column({ name: "significant_figures" })
  significantFigure!: number;

  @Column({ name: "ligand_id" })
  ligandId!: number;

  @Column({ name: "metal_id" })
  metalId!: number;

  @Column({ name: "equilibrium_expression_id" })
  equilibriumExpressionId!: number;

  @Column({ name: "conditions_id" })
  conditionId!: number;

  @Column({ name: "uncertainty_id" })
  uncertaintyId!: number;

  @Column({ name: "footnote_id" })
  footnoteId!: number;

  @OneToOne(() => Ligand)
  @JoinColumn()
  ligands!: Ligand;

  @OneToOne(() => Metal)
  @JoinColumn()
  metals!: Metal;
}

@Entity({ name: "constants_user_gen" })
export class Constants_ug {
  @Column()
  id!: number;

  @Column()
  value?: number;

  @Column({ name: "significant_figures" })
  significant_figures?: number;

  @PrimaryColumn({ name: "ligand_id" })
  ligand_id?: number;

  @Column({ name: "metal_id" })
  metal_id?: number;

  @Column({ name: "equilibrium_expression_id" })
  equilibrium_expression_id?: number;

  @Column({ name: "conditions_id" })
  conditions_id?: number;

  @Column({ name: "uncertainty_id" })
  uncertainty_id?: number;

  @Column({ name: "footnote_id" })
  footnote_id?: number;  

  @Column ({ name: "user_id" })
  user_id?: string;

  @Column({ name:"timestamp" })
  timestamp?: Date
} 
