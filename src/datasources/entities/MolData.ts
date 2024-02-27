import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "Mol_data" })
export class MolData {
  @PrimaryColumn({ name: "Mol_ID" })
  id!: number;

  @Column({ name: "MoleculeID" })
  moleculeId!: number;

  @Column({ name: "MolDrawCode" })
  drawCode!: string;

  @Column()
  name!: string;
}

@Entity({ name: "Mol_data_user_generated" })
export class MolData_ug extends MolData {}
