import {Entity, Column, PrimaryColumn} from "typeorm"

export enum ConstantKind {
    Equilibrium = "Equilibrium",
    Enthalpy = "Enthalpy",
    Entropy = "Entropy"
}

@Entity({name: "conditions"})
export class Condition{
    @PrimaryColumn()
    id!: number;

    @Column("enum", {name: "constant_kind", enum: ConstantKind})
    constantKind!: ConstantKind;

    @Column()
    temperature!: number;

    @Column({name: "temperature_varies"})
    isTemperatureVaries!: boolean;

    @Column({name: "ionic_strength"})
    ionicStrength!: number;
}