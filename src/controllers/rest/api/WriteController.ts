import { Controller, Inject, Injectable } from "@tsed/di";
import { array, Description, Example, Post, Returns, Schema, Summary } from "@tsed/schema";
import { WRITER_DATA_SOURCE, WriterDataSource } from "../../../datasources/WriterDatasource";
import { DataSource } from "typeorm";
import { BodyParams } from "@tsed/platform-params";
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
            .into("metals_user_gen")
            .values([
                { id: 42 , central_element: "H", formula_string: "HZn", charge: 4},
                { id: 54, central_element: "Zn", formula_string: "oio", charge: 3}
            ])
            .execute()

        return "test complete... I think?"
    }
}
