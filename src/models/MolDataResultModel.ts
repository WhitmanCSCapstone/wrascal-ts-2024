import { number, object, string } from "@tsed/schema";
import { MolData } from "../datasources/entities/MolData";
import MolUtils from "../utils/MolUtils";

export class MolDataResultModel {
  id!: number;

  drawCode!: string;

  constructor(id: number, drawCode: string) {
    this.id = id;
    this.drawCode = drawCode;
  }

  public static fromRaw(raw: MolData): MolDataResultModel {
    const drawCode = MolUtils.decode(raw.drawCode);

    return new MolDataResultModel(raw.id, drawCode);
  }
}

export const MolDataResultModelSchema = object({
  id: number().description("ID of the compound"),
  drawCode: string().description("Draw code string, in standard MOL format")
});
