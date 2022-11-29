export default class StringUtils {
  public static format(str: string, ...args: string[]): string {
    return str.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] != "undefined" ? args[number] : match;
    });
  }
}
