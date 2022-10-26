import { number, object } from "@tsed/schema";

export class ConstantRequestModel {
  ligandId!: number;
  metalId!: number;

  constructor(ligandId: number, metalId: number) {
    this.ligandId = ligandId;
    this.metalId = metalId;
  }
}

export const ConstantRequestSchema = object({
  ligandId: number().description("Unique ID of the ligand"),
  metalId: number().description("Unique ID of the metal")
});

export const ConstantRequestExample = new ConstantRequestModel(414, 59);
