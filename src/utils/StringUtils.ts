export default class StringUtils {
  public static format(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] != "undefined" ? args[number] : match;
    });
  }

  public static base64ToUint8Array(str: string): Uint8Array {
    return Buffer.from(str, "base64");
  }

  public static uint8ArrayToBase64(arr: Uint8Array): string {
    return new TextDecoder("utf-8").decode(arr);
  }
}
