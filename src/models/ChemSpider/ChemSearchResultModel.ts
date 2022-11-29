import StringUtils from "../../utils/StringUtils";
import { number, object, string } from "@tsed/schema";

const RSC_WEB_PAGE_URI = "https://www.chemspider.com/Chemical-Structure.{0}.html";
const CHEM_IMAGE_URI = "https://www.chemspider.com/ImagesHandler.ashx?id={0}&w={1}&h={2}";

class Link {
  rscLink: string;
  imgLink: string;

  constructor(rscLink: string, imgLink: string) {
    this.rscLink = rscLink;
    this.imgLink = imgLink;
  }
}

export class Dimensions {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class ChemSearchResultModel {
  id: number;
  links: Link;
  dimensions: Dimensions;

  constructor(id: number, width: number, height: number) {
    const imgUri = StringUtils.format(CHEM_IMAGE_URI, id.toString(), width.toString(), height.toString());
    const rscUri = StringUtils.format(RSC_WEB_PAGE_URI, id.toString());

    this.id = id;
    this.links = new Link(rscUri, imgUri);
    this.dimensions = new Dimensions(width, height);
  }
}

export const ChemSearchResultSchema = object({
  id: number().description("ChemSpider ID"),
  links: object({
    rscLink: string(),
    imgLink: string()
  }).description("Links for the chem"),
  dimensions: object({
    width: number(),
    height: number()
  }).description("Dimensions for the chem image")
});
