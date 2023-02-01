import { number, object, string } from "@tsed/schema";
import MolUtils from "../utils/MolUtils";

export class MolDataRawResultModel {
  id!: number;
  name!: string;
  molId!: string;
  drawCode!: string;

  public static decode(raw: MolDataRawResultModel): MolDataRawResultModel {
    const drawCode = MolUtils.decode(raw.drawCode);
    const result = new MolDataRawResultModel();

    result.id = raw.id;
    result.name = raw.name;
    result.molId = raw.molId;
    result.drawCode = drawCode;

    return result;
  }
}

export const MolDataResultModelSchema = object({
  id: number().description("ID of the compound"),
  drawCode: string().description("Draw code string, in standard MOL format")
});
