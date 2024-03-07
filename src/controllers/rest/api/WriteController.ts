import { Controller, Inject, Injectable } from "@tsed/di";
import { array, Description, Example, Post, Returns, Schema, string, Summary } from "@tsed/schema";
import { WRITER_DATA_SOURCE, WriterDataSource } from "../../../datasources/WriterDatasource";
import { DataSource, QueryFailedError } from "typeorm";
import { BodyParams } from "@tsed/platform-params";
import { Metals_ug } from "../../../datasources/entities/Metal";
import { Conditions_ug } from "src/datasources/entities/Condition";
import { EquilibriumExpression_ug, ExpressionEntry } from "src/datasources/entities/EquilibriumExpression";
import { Ligands_ug, LigandForm, Element, MolecularFormula, MolecularFormulaEntry, Ligand } from "../../../datasources/entities/Ligand";

import { Constant } from "../../../datasources/entities/Constant";
import { BadRequest } from "@tsed/exceptions";
import cors from "cors";
import * as mod from "src/models/WriteRequestModel";
import { EquilibriumExpression } from "src/datasources/entities/EquilibriumExpression";
import { equal } from "assert";
import exp from "constants";


const tables: {[tableString: string]: any} =  {
    // "Mol_data":
    // "Verkn_ligand_metal_literature":
    //"conditions"
    "conditions_user_gen": Conditions_ug,
    // "constants_user_gen": Constant_ug,
    // "equilibrium_expressions":
    "equilibrium_expressions_user_gen": EquilibriumExpression_ug,
    // "footnotes":
    // "ligands":
    // "ligands_mapping":
    // "ligands_mapping_user_gen":
    "ligands_user_gen": Ligands_ug,
    // "literatures":
    // "metals":
    "metals_user_gen": Metals_ug
    // "uncertainties":
    // "uncertainties_user_gen":
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

        // automatic data marshalling either doesn't work for SELECT queries, or something else is up.
        // This is a quick and easy solution.
        const temp_ligand = {
            "name": input.ligandInfo.name,
            "charge": input.ligandInfo.charge,
            "molecular_formula": input.ligandInfo.molecular_formula,
            "form": input.ligandInfo.form,
            "categories": input.ligandInfo.categories
        };

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

        // write Equilibrium Expression data
        var data = input.equilibriumExpressionInfo;
        const temp_eq = {
            "expression_string": data.expression_string,
            "products": data.products,
            "reactants": data.reactants
        }

        var eq_expr_id = await this.getId('equilibrium_expressions_user_gen', temp_eq);
        console.log("eq_expr lookup: ", eq_expr_id);
        if (!eq_expr_id) {
            await this.writeDB('equilibrium_expressions_user_gen', input.equilibriumExpressionInfo);
            eq_expr_id = await this.getId('equilibrium_expressions_user_gen', temp_eq);
        }

        // build constant query


        
        return "test complete... I think?"
    }

    @Post("/test")
    async testBench(@BodyParams() input: mod.writeRequest): Promise<String> {

        // var molString = '("{""(C,2)"",""(H,5)"",""(N,1)"",""(O,2)""}",0)'
        // var mol_formula: MolecularFormula = MolecularFormula.fromStr(molString)
        // console.log(JSON.stringify(mol_formula))

        // input.ligandInfo.molecular_formula = mol_formula;
        // input.ligandInfo.form = LigandForm.fromStr('(1, 0)');
        // console.log(JSON.stringify(input.ligandInfo))

        // we love technical debt!!!

        // write Equilibrium Expression data
        var data = input.equilibriumExpressionInfo;
        var exprList: string[] = [];
        
        console.log(typeof(input.equilibriumExpressionInfo.products))
        data.reactants?.forEach((element) => {
            console.log(element)
            var asStr = ExpressionEntry.toStr(element)
            console.log(asStr)
            exprList.push(asStr)
        })
        console.log(exprList)

        this.writeDB('equilibrium_expressions_user_gen', input.equilibriumExpressionInfo)
        // var eq_expr_id = await this.getId('equilibrium_expressions_user_gen', temp_eq);
        // console.log("eq_expr lookup: ", eq_expr_id);
        // if (!eq_expr_id) {
        //     await this.writeDB('equilibrium_expressions_user_gen', input.equilibriumExpressionInfo);
        //     eq_expr_id = await this.getId('equilibrium_expressions_user_gen', temp_eq);
        // }


        return "test complete!"
    }

    // Queries the given table for an entry that matches the parameters given.
    // Returns the id column of the found row, if there was one; if not, returns null
    // (note that this will return null if the table has no id column, even if a row is found)
    async getId(table: string, valuesCheckAgainst: {[s: string]: any}) {
        var toAppend = '';
        var retstring = '';
        for (const key in valuesCheckAgainst)
        {
            toAppend = key.concat(" = :".concat(key.concat(" AND ")));
            retstring = retstring.concat(toAppend)
        }
        retstring = retstring.slice(0, -5);
        var result = null;
        try {
            result = await WriterDataSource
                .getRepository(tables[table])
                .createQueryBuilder()
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
        await WriterDataSource
            .getRepository(tables[table])
            .createQueryBuilder()
            .insert()
            .values(valuesToInsert)
            .execute()
    }
}
