import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "ligands_mapping" })
export class LigandMapping {
  @PrimaryColumn({ name: "Liganden_ID" })
  ligandenId!: number;

  @Column({ name: "LigandID" })
  ligandId!: number;

  @Column({ name: "LigandName" })
  ligandName!: string;

  @Column({ name: "LigandFormula" })
  ligandFormula!: string;

  @Column({ name: "LigandProtonation" })
  ligandProtonation!: string;

  @Column({ name: "LigandClassID" })
  ligandClassId!: number;

  @Column({ name: "MoleculeID" })
  moleculeId!: number;
}
