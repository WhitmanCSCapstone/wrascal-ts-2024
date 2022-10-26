export default class StringUtils {
  public static parsePgArray(str: string): string[] {
    str = str.replace("{", "").replace("}", "");

    if (str.length === 0) return [];

    const result = [];
    let contents = str.split(",");

    let prevHasSym = false;
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].startsWith('""')) contents[i] = contents[i].substring(2);
      if (contents[i].endsWith('""')) contents[i] = contents[i].substring(0, contents[i].length - 2);
      if (contents[i].startsWith('"')) {
        prevHasSym = true;
        contents[i] = contents[i].substring(1);
      }
      if (contents[i].endsWith('"') && prevHasSym) {
        contents[i] = contents[i].substring(0, contents[i].length - 1);
        prevHasSym = false;
      }
    }

    while (contents.length !== 0) {
      let chunkResult = contents[0];
      contents = contents.slice(1);

      while (!contents[0].endsWith(")")) {
        chunkResult += `,${contents[0]}`;
        contents = contents.slice(1);
      }

      chunkResult += `,${contents[0]}`;
      contents = contents.slice(1);
      result.push(chunkResult);
    }

    return result;
  }

  public static parsePgObject(str: string): string[] {
    str = str.substring(1).substring(0, str.length - 2);

    if (str.length === 0) return [];

    const result = [];
    let contents = str.split(",");

    while (contents.length !== 0) {
      let chunkResult = contents[0];

      if (chunkResult[0] === '"' && (!chunkResult.endsWith('"') || chunkResult.endsWith('""'))) {
        contents = contents.slice(1);
        while (!contents[0].endsWith('"') || contents[0].endsWith('""')) {
          chunkResult += `,${contents[0]}`;
          contents = contents.slice(1);
        }

        chunkResult += `,${contents[0]}`;
        contents = contents.slice(1);
        result.push(chunkResult);
        continue;
      }

      result.push(chunkResult);
      contents = contents.slice(1);
    }

    return result;
  }
}
