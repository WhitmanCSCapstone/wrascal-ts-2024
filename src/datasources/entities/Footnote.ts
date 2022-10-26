import { Column, Entity, PrimaryColumn } from "typeorm";
import StringUtils from "../../utils/StringUtils";

export enum NoteType {
  Solid = "Solid",
  TemperatureRange = "TemperatureRange",
  BackgroundElectrolyte = "BackgroundElectrolyte",
  CorrectedForBackgroundElectrolyte = "CorrectedForBackgroundElectrolyte",
  AdjustedForCompatibility = "AdjustedForCompatibility",
  AdjustedToProtonationConstant = "AdjustedToProtonationConstant",
  AdjustedReasonUnknown = "AdjustedReasonUnknown",
  Molal = "Molal",
  CisIsomer = "CisIsomer",
  TransIsomer = "TransIsomer",
  DIsomer = "DIsomer",
  UnstatedIsomer = "UnstatedIsomer",
  UnstatedOpticalIsomer = "UnstatedOpticalIsomer",
  Other = "Other"
}

export class Note {
  type: NoteType;
  content: string;

  constructor(type: NoteType, content: string) {
    this.type = type;
    this.content = content;
  }

  public static fromStr(str: string): Note {
    const [typeStr, content] = StringUtils.parsePgObject(str);
    const type = typeStr as NoteType;

    return new Note(type, content);
  }

  public static toStr(obj: Note): string {
    let content = obj.content;

    if (/^[A-Za-z0-9]*$/.test(obj.content)) content = `"${content}"`;

    return `(${obj.type},${content})`;
  }
}

export function toNoteArray(value: string): Note[] {
  const array = StringUtils.parsePgArray(value);
  const result: Note[] = [];

  array.forEach(function (str) {
    result.push(Note.fromStr(str));
  });

  return result;
}

@Entity({ name: "footnotes" })
export class FootNote {
  @PrimaryColumn()
  id!: number;

  @Column({ name: "legacy_identifier" })
  legacyId!: string;

  @Column("text", {
    transformer: {
      from(value: string): Note[] {
        return toNoteArray(value);
      },
      to(value: Note[]): string {
        const parsedArr: string[] = [];

        value.forEach(function (obj) {
          parsedArr.push(Note.toStr(obj));
        });

        return `{${parsedArr.join(",")}}`;
      }
    }
  })
  notes!: string;
}
