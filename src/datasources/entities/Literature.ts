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
export class Literature_ug {
  @PrimaryColumn({ name: "id" })
  id!: number;

  @Column({ name: "LitAlt_ID" })
  LitAlt_ID?: number;

  @Column({ name: "LitRef" })
  LitRef?: string;

  @Column({ name: "LitCode" })
  LitCode?: string;
}
