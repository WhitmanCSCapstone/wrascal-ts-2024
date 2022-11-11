import { number, object, string } from "@tsed/schema";

export class ReferenceFetchResultModel {
  litAltId!: number;
  litId!: number;
  reference!: string;
  code!: string;
}

export const ReferenceFetchResultSchema = object({
  litAltId: number().description("Reference Alt ID"),
  litId: number().description("Reference ID"),
  reference: string().description("Reference Content"),
  code: string().description("Reference Code")
});
