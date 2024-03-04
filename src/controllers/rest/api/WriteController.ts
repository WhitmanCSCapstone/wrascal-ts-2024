import { Controller, Inject, Injectable } from "@tsed/di";
import { array, Description, Example, Post, Returns, Schema, string, Summary } from "@tsed/schema";
import { WRITER_DATA_SOURCE, WriterDataSource } from "../../../datasources/WriterDatasource";
import { DataSource, QueryFailedError } from "typeorm";
import { BodyParams } from "@tsed/platform-params";
import { Metal_ug } from "../../../datasources/entities/Metal";
import { Condition_ug } from "src/datasources/entities/Condition";
import { Ligand_ug, LigandForm, Element, MolecularFormula, MolecularFormulaEntry } from "../../../datasources/entities/Ligand";

import { Constant } from "../../../datasources/entities/Constant";
import { BadRequest } from "@tsed/exceptions";
import cors from "cors";
import * as mod from "src/models/WriteRequestModel";


enum num2Table {
    // "Mol_data":
    // "Verkn_ligand_metal_literature":
    //"conditions"
    Condition_ug,
    // "equilibrium_expressions":
    // "equilibrium_expressions_user_gen":
    // "footnotes":
    // "ligands":
    // "ligands_mapping":
    // "ligands_mapping_user_gen":
    Ligand_ug,
    // "literatures":
    // "metals":
    Metal_ug
    // "uncertainties":
    // "uncertainties_user_gen":
}

enum stringTable2Num {
    "conditions_user_gen",
    "ligands_user_gen",
    "metals_user_gen"      
}

@Injectable()
@Controller("/write")
export class WriteController {

    // @Inject(WRITER_DATA_SOURCE)
    // protected dataSource: DataSource;

    $onInit() {
        if (WriterDataSource.isInitialized) {
            console.log("Writeable Data Source is Ready")
        }
    }

    @Post("/db", cors())
    async write(@BodyParams() input: mod.writeRequest): Promise<String> {

        console.log(input)

        // write metal/ get id
        var metalid = await this.getId('metals_user_gen', input.metalInfo);
        console.log("metalLookup", metalid)
        if (!metalid) {
            await this.writeDB('metals_user_gen', input.metalInfo);
            metalid = await this.getId('metals_user_gen', input.metalInfo);
        }

        // write ligand/get id
        var ligandid = await this.getId('ligands_user_gen', input.ligandInfo);
        console.log("ligandLookup: ", ligandid);
        console.log(input.ligandInfo)
        if (!ligandid) {
            await this.writeDB('ligands_user_gen', input.ligandInfo);
            ligandid = await this.getId('ligands_user_gen', input.ligandInfo);
        }

        // write conditions/get id
        var conditionsid = await this.getId('conditions_user_gen', input.conditionsInfo);
        console.log("ConditionsLookup: ", conditionsid);
        if (!conditionsid) {
            await this.writeDB('conditions_user_gen', input.conditionsInfo);
            conditionsid = await this.getId('conditions_user_gen', input.conditionsInfo);
        }

        // build constant query


        
        return "test complete... I think?"
    }

    @Post("/test")
    async testBench(@BodyParams() input: mod.writeRequest): Promise<String> {

        var molString = '("{""(C,2)"",""(H,5)"",""(N,1)"",""(O,2)""}",0)'
        var mol_formula: MolecularFormula = MolecularFormula.fromStr(molString)
        console.log(JSON.stringify(mol_formula))

        input.ligandInfo.molecular_formula = mol_formula;
        input.ligandInfo.form = LigandForm.fromStr('(1, 0)');
        console.log(JSON.stringify(input.ligandInfo))


        var query = await WriterDataSource
            .getRepository(Ligand_ug)
            .createQueryBuilder()
            .insert()
            .values(input.ligandInfo)
            .getSql()
        console.log(query)


       await this.writeDB('ligands_user_gen', input.ligandInfo)

        return "test complete!"
    }

    // Queries the given table for an entry that matches the parameters given.
    // Returns the id column of the found row, if there was one; if not, returns null
    // (note that this will return null if the table has no id column, even if a row is found)
    async getId(table: string, valuesCheckAgainst: {[s: string]: any}) {
        var toAppend = '';
        var retstring = '';
        var ent = num2Table[stringTable2Num[table]]; // look up the table in the enums
        for (const key in valuesCheckAgainst)
        {
            toAppend = key.concat(" = :".concat(key.concat(" AND ")));
            retstring = retstring.concat(toAppend)
        }
        retstring = retstring.slice(0, -5);

        var result = null;
        try {
            result = await WriterDataSource
                .getRepository(ent)
                .createQueryBuilder("result")
                .where(retstring, valuesCheckAgainst)
                .getOne()
        } catch (QueryFailedError) {
            console.log("Query Failed!");
            return null;
        }

        if (result && result.id) {
            console.log("returning id");
            return result.id;
        } else {
            console.log("result either is null or doesn't have an id");
            return null;
        }

        
    }

    // this would be a sweet method but idk how to write
    async writeDB(table: string, valuesToInsert: {[s:string]: any}) {
        var ent = num2Table[stringTable2Num[table]];
        console.log(ent)
        await WriterDataSource
            .getRepository(ent)
            .createQueryBuilder()
            .insert()
            .values(valuesToInsert)
            .execute()
    }
}
