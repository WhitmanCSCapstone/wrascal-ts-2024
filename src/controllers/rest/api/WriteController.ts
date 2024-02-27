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
import { WriteRequestModel, WriteRequestSchema, WriteRequestExample, WriteRequestExampleSchema } from "src/models/WriteRequestModel";
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
    async write(@BodyParams() @Schema(WriteRequestExampleSchema) input: WriteRequestExample): Promise<String> {

        await WriterDataSource
            .createQueryBuilder()
            .insert()
            .into(Metal_ug)
            .values([
                { id: input.metal_id, formulaString: input.ligand_name, charge: 4},
            ])
            .execute()

        

        return "test complete... I think?"
    }
}
