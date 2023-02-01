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
