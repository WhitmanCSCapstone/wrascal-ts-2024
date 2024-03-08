import { Column, Entity, PrimaryColumn } from "typeorm";

export enum uncertaintydirection {
    Positive = "Positive",
    Negative = "Negative",
    Both = "Both"
}

@Entity({ name: "uncertainties_user_gen" })
export class Uncertainties_ug {
  @PrimaryColumn({ name:"id" })
  id!: number;

  @Column({ name:"direction" })
  direction?: uncertaintydirection;

  @Column({ name:"magnitude" })
  magnitude?: number;
}
