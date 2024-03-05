import { Column, Entity, PrimaryColumn } from "typeorm";

export enum ConstantKind {
  Equilibrium = "Equilibrium",
  Enthalpy = "Enthalpy",
  Entropy = "Entropy"
}

@Entity({ name: "conditions" })
export class Condition {
  @PrimaryColumn()
  id!: number;

  @Column("enum", { name: "constant_kind", enum: ConstantKind })
  constantKind!: ConstantKind;

  @Column()
  temperature!: number;

  @Column({ name: "temperature_varies" })
  isTemperatureVaries!: boolean;

  @Column({ name: "ionic_strength" })
  ionicStrength!: number;
}

@Entity({ name: "conditions_user_gen" })
export class Condition_ug {
  @PrimaryColumn()
  id!: number;

  @Column({ name: "constant_kind", enum: ConstantKind, nullable: true })
  constant_kind?: ConstantKind;

  @Column({ name: "temperature", nullable: true})
  temperature?: number;

  @Column({ name: "temperature_varies", nullable: true })
  temperature_varies?: boolean;

  @Column({ name: "ionic_strength", nullable: true })
  ionic_strength?: number;
}
