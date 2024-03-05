import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "literatures" })
export class Literature {
  @PrimaryColumn({ name: "LitAlt_ID" })
  altId!: number;

  @Column({ name: "LitID" })
  id!: number;

  @Column({ name: "LitRef" })
  reference!: string;

  @Column({ name: "LitCode" })
  code!: string;
}

@Entity({ name: "literatures_user_gen" })
export class Literature_ug extends Literature {}
