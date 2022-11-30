import { Controller } from "@tsed/di";
import { array, Description, Example, Get, Post, Returns, Summary } from "@tsed/schema";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { BadRequest } from "@tsed/exceptions";
import axios from "axios";
import FilterByNameResultModel from "../../../models/ChemSpider/FilterByNameResultModel";
import StringUtils from "../../../utils/StringUtils";
import QueryResultModel from "../../../models/ChemSpider/QueryResultModel";
import { ChemSearchResultModel, ChemSearchResultSchema, Dimensions } from "../../../models/ChemSpider/ChemSearchResultModel";

const API_ROOT = "https://api.rsc.org/compounds/v1";
const FILTER_BY_NAME_API = `${API_ROOT}/filter/name`;
const QUERY_RESULT_API = `${API_ROOT}/filter/{0}/results`;

const errMessages: Record<number, string> = {
  400: "Bad Request. Check the request you sent and try again.",
  401: "Unauthorized. Check you have supplied the correct API key and that you have sent it as an HTTP Header called 'apikey'.",
  404: "Not Found. The requested endpoint URL is not recognized. Change your request and try again.",
  405: "Method Not Allowed. The verb is incorrect for the endpoint. Change your request and try again.",
  413: "Payload Too Large. The request you sent was too big to handle. Change your request and try again.",
  429: "Too Many Requests. Send fewer requests, or use rate-limiting to slow them down, then try again.",
  500: "Internal Server Error. Wait and try again.",
  502: "Service Unavailable. Wait and try again."
};
const apiKeys = ["WTGGGNDksbbk7P8JRBiwBGvTnU6EiWd6", "93aLDMvd2AcG5eLn88mGDYzHZveuUnTV"];

@Controller("/rsc")
export class ChemSpiderController {
  private static getChemSpiderErrorMsg(statusCode: number, message: string = "API"): string {
    if (!(statusCode in errMessages)) return `${message}: Unknown error, please contact developer.`;

    return `${message}: errMessages[statusCode]`;
  }

  @Get("/search/:name")
  @Returns(400).Description("Invalid Chem name")
  @Returns(200, ChemSearchResultModel).Description("All the search result with given name.").Schema(array().items(ChemSearchResultSchema))
  @Summary("Search compounds using name")
  @Description("Search compounds using name, returns an array of result.")
  async searchByName(@PathParams("name") @Example("EDTA") name?: string): Promise<ChemSearchResultModel[]> {
    if (!name || name == "") throw new BadRequest("name is empty!");

    return await this.getChemSpiderSearchResult(name);
  }

  @Post("/search/:name")
  @Returns(400).Description("Invalid Chem name")
  @Returns(200, ChemSearchResultModel).Description("All the search result with given name.").Schema(array().items(ChemSearchResultSchema))
  @Summary("Search compounds using name with custom image dimensions")
  @Description("Search compounds using name with custom image dimensions, returns an array of result.")
  async searchByNameWithDimension(
    @PathParams("name") @Example("EDTA") name?: string,
    @BodyParams() @Example(new Dimensions(250, 250)) dimensions?: Dimensions
  ): Promise<ChemSearchResultModel[]> {
    if (!name || name == "") throw new BadRequest("name is empty!");

    dimensions ??= new Dimensions(250, 250);
    if (dimensions.width <= 0 || dimensions.height <= 0) {
      dimensions.width = 250;
      dimensions.height = 250;
    }

    return await this.getChemSpiderSearchResult(name, dimensions.width, dimensions.height);
  }

  private getRndApiKey(): string {
    return apiKeys[Math.floor(Math.random() * apiKeys.length)];
  }

  private async getChemSpiderSearchResult(name: string, width: number = 250, height: number = 250): Promise<ChemSearchResultModel[]> {
    const result: ChemSearchResultModel[] = [];

    const apiKey = this.getRndApiKey();
    const requestHeader = {
      "Content-Type": "application/json",
      Accept: "application/json",
      apikey: apiKey
    };

    const { data, status } = await axios.post<FilterByNameResultModel>(
      FILTER_BY_NAME_API,
      { name: name },
      {
        headers: requestHeader
      }
    );

    if (!data || !data.queryId || status !== 200)
      throw new BadRequest(ChemSpiderController.getChemSpiderErrorMsg(status), "ChemSpider Query API");

    const queryId = data.queryId;
    const queryResultUrl = StringUtils.format(QUERY_RESULT_API, queryId);

    const response = await axios.get<QueryResultModel>(queryResultUrl, {
      headers: requestHeader
    });
    const resultData = response.data;
    const resultStatus = response.status;

    if (!resultData || !resultData.results || resultStatus !== 200)
      throw new BadRequest(ChemSpiderController.getChemSpiderErrorMsg(resultStatus), "ChemSpider Query Result API");

    for (const id of resultData.results) {
      result.push(new ChemSearchResultModel(id, width, height));
    }

    return result;
  }
}
