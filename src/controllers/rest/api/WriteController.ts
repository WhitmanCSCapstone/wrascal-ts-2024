import { Controller, Inject, Injectable } from "@tsed/di";
import { array, Description, Example, Post, Returns, Schema, Summary } from "@tsed/schema";
import { WRITER_DATA_SOURCE, WriterDataSource } from "../../../datasources/WriterDatasource";
import { DataSource } from "typeorm";
import { BodyParams } from "@tsed/platform-params";
import { Metal_ug } from "../../../datasources/entities/Metal";
import { Ligand_ug, LigandForm, Element, MolecularFormula, MolecularFormulaEntry } from "../../../datasources/entities/Ligand";
// import { Metal_User_Gen } from "src/datasources/entities/Metal_user_gen.ts";}
import { Constant } from "../../../datasources/entities/Constant";
import { BadRequest } from "@tsed/exceptions";
//import { Metal_User_Gen } from "src/datasources/entities/Metal_User_Gen";

@Injectable()
@Controller("/write")
export class WriteController {

    // @Inject(WRITER_DATA_SOURCE)
    // protected dataSource: DataSource;

    $onInit() {
        if (WriterDataSource.isInitialized) {
            console.log("GRRRRR")
        }
    }

    @Post("/db")
    async write(@BodyParams() input: String[]): Promise<String> {

        await WriterDataSource
            .createQueryBuilder()
            .insert()
            .into(Metal_ug)
            .values([
                { id: 42 , centralElement: Element.H, formulaString: "HZn", charge: 4},
                { id: 54, centralElement: Element.O, formulaString: "oio", charge: 3}
            ])
            .createQueryBuilder()
            .insert()
            .into(Ligand_ug)
            .values([
                { id: 1, name: "miceandsmen", charge: 0, categories: ["carboxyl","glutaric"]}
            ])
            .execute()

        /*molecularFormula: '{""(C,4)"",""(H,8)"",""(N,2)"",""(O,3)""}',*/

        return "test complete... I think?"
    }
}
