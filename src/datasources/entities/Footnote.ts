import { Column, Entity, PrimaryColumn } from "typeorm";
import { object, serializeEnum, string } from "@tsed/schema";

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

export const NoteSchema = object({
  type: serializeEnum(NoteType),
  content: string()
});

export class Note {
  type: NoteType;
  content: string;

  constructor(type: NoteType, content: string) {
    this.type = type;
    this.content = content;
  }

  public static fromStr(str: string): Note {
    str = str.substring(1, str.length - 1);

    const typeStr = str.split(",")[0];
    const content = str.substring(`${typeStr},`.length);
    const type = typeStr as NoteType;

    return new Note(type, content);
  }

  public static toStr(obj: Note): string {
    let content = obj.content;

    if (/^[A-Za-z0-9]*$/.test(obj.content)) content = `"${content}"`;

    return `(${obj.type},${content})`;
  }
}

export function toNoteArray(str: string): Note[] {
  const result: Note[] = [];
  const regex = /\([a-zA-Z]+,(?:[-0-9a-zA-Z]|".+")*\)/g;

  if (!str) return result;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [...str.matchAll(regex)].forEach((match, i) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    match.forEach((value, j) => {
      result.push(Note.fromStr(value));
    });
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
