export default class ArrayUtils {
  public static any<T>(arr?: T[]): boolean {
    return !!(arr && arr.length);
  }
}
