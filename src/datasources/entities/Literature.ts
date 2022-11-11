import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "literatures" })
export class Literature {
  @PrimaryColumn({ name: "LitAlt_ID" })
  altId!: number;

  @Column({ name: "LitID" })
  id!: number;

  @Column({ name: "LItRef" })
  reference!: string;

  @Column({ name: "LitCode" })
  code!: string;
}
