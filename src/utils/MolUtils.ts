import StringUtils from "./StringUtils";
import * as zlib from "zlib";

export default class MolUtils {
  public static getNewLigandMapping(old: number): number {
    //TODO: Add mapping logic
    return old;
  }

  public static decode(originalStr: string): string {
    const urlDecoded = decodeURIComponent(originalStr);
    const bytes = StringUtils.base64ToUint8Array(urlDecoded);

    return zlib.inflateSync(bytes).toString("utf8");
  }
}
