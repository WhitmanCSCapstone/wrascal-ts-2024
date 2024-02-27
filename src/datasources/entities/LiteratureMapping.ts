import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "Verkn_ligand_metal_literature" })
export class LiteratureMapping {
  @PrimaryColumn({ name: "vlml_id" })
  mappingId!: number;

  @Column({ name: "VLigandMetalLitID" })
  metalLiteratureId!: number;

  @Column({ name: "LigandID" })
  ligandId!: number;

  @Column({ name: "MetalID" })
  metalId!: number;

  @Column({ name: "LitID" })
  literatureId!: number;

  @Column({ name: "LitCodeSign" })
  codeSign!: number;
}

@Entity({ name: "Verkn_ligand_metal_literature_user_gen" }) // doesn't exist in database yet
export class LiteratureMapping_ug extends LiteratureMapping {}
