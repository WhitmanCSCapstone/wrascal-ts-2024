import { Controller, Inject, Injectable } from "@tsed/di";
import { array, Description, Example, Post, Returns, Schema, string, Summary } from "@tsed/schema";
import { WRITER_DATA_SOURCE, WriterDataSource } from "../../../datasources/WriterDatasource";
import { DataSource, QueryFailedError } from "typeorm";
import { BodyParams } from "@tsed/platform-params";
import { Metals_ug } from "../../../datasources/entities/Metal";
import { Conditions_ug } from "src/datasources/entities/Condition";
import ExpressionEntryParserConfig, { EquilibriumExpression_ug, ExpressionEntry } from "src/datasources/entities/EquilibriumExpression";
import { Ligands_ug, LigandForm, Element, MolecularFormula, MolecularFormulaEntry, Ligand } from "../../../datasources/entities/Ligand";
import { Constants_ug } from "../../../datasources/entities/Constant";
import { FootNote_ug } from "src/datasources/entities/Footnote";
import { LiteratureMapping_ug } from "src/datasources/entities/LiteratureMapping";

import { Constant } from "../../../datasources/entities/Constant";
import { BadRequest } from "@tsed/exceptions";
import cors from "cors";
import * as mod from "src/models/WriteRequestModel";
import { EquilibriumExpression } from "src/datasources/entities/EquilibriumExpression";
import { equal } from "assert";
import exp from "constants";
import { Uncertainties_ug } from "src/datasources/entities/Uncertainties";
import { Literature_ug } from "src/datasources/entities/Literature";
import { Note } from "src/datasources/entities/Footnote";
import { get } from "http";


const tables: {[tableString: string]: any} =  {
    // "Mol_data":
    // "Verkn_ligand_metal_literature":
    //"conditions"
    "conditions_user_gen": Conditions_ug,
    "constants_user_gen": Constants_ug,
    // "equilibrium_expressions":
    "equilibrium_expressions_user_gen": EquilibriumExpression_ug,
    // "footnotes":
    "footnotes_user_gen": FootNote_ug,
    // "ligands":
    // "ligands_mapping":
    // "ligands_mapping_user_gen":
    "ligands_user_gen": Ligands_ug,
    "literatures_user_gen": Literature_ug,
    // "metals":
    "metals_user_gen": Metals_ug,
    // "uncertainties":
    "uncertainties_user_gen": Uncertainties_ug,
    "Verkn_ligand_metal_literature_user_gen": LiteratureMapping_ug
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
        var metal_id = await this.getId('metals_user_gen', input.metalInfo);
        if (!metal_id) {
            await this.writeDB('metals_user_gen', input.metalInfo);
            metal_id = await this.getId('metals_user_gen', input.metalInfo);
        }

        console.log("metal_id: ", metal_id)
        // automatic data marshalling either doesn't work for SELECT queries, or something else is up.
        // This is a quick and easy solution.

        const temp_ligand = {
            "name": input.ligandInfo.name,
            "molecular_formula": MolecularFormula.toStr(input.ligandInfo.molecular_formula as MolecularFormula),
            "charge": input.ligandInfo.charge,
            "form": LigandForm.toStr(input.ligandInfo.form as LigandForm),
            "categories": input.ligandInfo.categories
        }

        // write ligand/get id
        var ligand_id = await this.getId('ligands_user_gen', temp_ligand);
        if (!ligand_id) {
            await this.writeDB('ligands_user_gen', input.ligandInfo);
            ligand_id = await this.getId('ligands_user_gen', temp_ligand);
        }

        console.log("ligand_id", ligand_id)

        // write conditions/get id
        var conditions_id = await this.getId('conditions_user_gen', input.conditionsInfo);
        if (!conditions_id) {
            await this.writeDB('conditions_user_gen', input.conditionsInfo);
            conditions_id = await this.getId('conditions_user_gen', input.conditionsInfo);
        }
        console.log("conditions_id", conditions_id)

        // write Equilibrium Expression data.
        // the database gets all weird about searching while the data is in 
        // ExpressionEntry[] form, and the transformer doesn't activate...
        // I don't know why. It would be worth looking into. In the meantime, this is
        // just manually marshalling the data in the same protocol as the transformer,
        // ExpressionEntryParserConfig() in datasources/entities/EquilibriumExpression.ts
        var parsedArr: string[] = [];
        input.equilibriumExpressionInfo.products?.forEach(function (obj) {
            parsedArr.push(ExpressionEntry.toStr(obj));
        });
        const stringProducts =  `{${parsedArr.join(",")}}`;

        parsedArr = []
        input.equilibriumExpressionInfo.reactants?.forEach(function (obj) {
            parsedArr.push(ExpressionEntry.toStr(obj));
        });
        const stringReactants =  `{${parsedArr.join(",")}}`;

        const temp_eq = {
            "expression_string": input.equilibriumExpressionInfo.expression_string,
            "products": stringProducts,
            "reactants": stringReactants
        }
        var eq_expr_id = await this.getId('equilibrium_expressions_user_gen', temp_eq);
        if (!eq_expr_id) {
            await this.writeDB('equilibrium_expressions_user_gen', input.equilibriumExpressionInfo);
            eq_expr_id = await this.getId('equilibrium_expressions_user_gen', temp_eq);
        }
        console.log("eq_expr_id:", eq_expr_id)


        // write the uncertaincies
        var uncertainties_id = await this.getId('uncertainties_user_gen', input.uncertaintiesInfo);
        if (!uncertainties_id) {
            await this.writeDB('uncertainties_user_gen', input.uncertaintiesInfo);
            uncertainties_id = await this.getId('uncertainties_user_gen', input.uncertaintiesInfo);
        }

        console.log("uncertainties_id", uncertainties_id)

        // write the literatures info
        // for some reason, literatures_user_gen won't search correctly... no idea why.
        // It writes a new row every time and doesn't include a reference to its id. This is tragic.
        var literatures_id = await this.getId('literatures_user_gen', input.literaturesInfo);
        if (!literatures_id) {
            await this.writeDB('literatures_user_gen', input.literaturesInfo);
            literatures_id = await this.getId('literatures_user_gen', input.literaturesInfo);
            await WriterDataSource
                .createQueryBuilder()
                .update(Literature_ug)
                .set({
                    LitAlt_ID: () => 'id'
                })
                .where("id = :id", { id: literatures_id })
                .execute()
        }
        console.log("literatures_id", literatures_id)

        // make footnotes query
        // same as equilibrium Expressions, the select query tool is weird and
        // the easiest workaround is to manually marshal the data here.

        var parsedArr: string[] = [];
        input.footnotesInfo.notes?.forEach(function (obj) {
            parsedArr.push(Note.toStr(obj));
        });
        const notesAsString =  `{${parsedArr.join(",")}}`;

        const temp_footnotes = {
            "notes":notesAsString
        }

        var footnote_id = await this.getId('footnotes_user_gen', temp_footnotes);
        if (!footnote_id) {
            this.writeDB('footnotes_user_gen', input.footnotesInfo)
            footnote_id = this.getId('footnotes_user_gen', temp_footnotes)
        }

        console.log("footnote_id: ", footnote_id)
    
        // build constant query
        var constants_entry = {
            "ligand_id": ligand_id,
            "metal_id": metal_id,
            "equilibrium_expression_id": eq_expr_id,
            "value": input.constantsInfo.value,
            "significant_figures": input.constantsInfo.significant_figures,
            "conditions_id": conditions_id,
            "uncertainty_id": uncertainties_id,
            "footnote_id": footnote_id,
            "user_id": input.constantsInfo.user_id
        }

        var constants_id = await this.getId('constants_user_gen', constants_entry)
        if (!constants_id){
            await this.writeDB('constants_user_gen', constants_entry);
        }

        // map the literature to the footnote
        var temp_verkn = {
            LigandId: ligand_id,
            MetalId: metal_id,
            LiteratureId: literatures_id,
        }
        var verkn_id = await this.getId('Verkn_ligand_metal_literature_user_gen', temp_verkn)
        if (!verkn_id) {
            await this.writeDB('Verkn_ligand_metal_literature_user_gen', temp_verkn)
            
        }

        return "data written successfully!"
    }

    @Post("/test")
    async testBench(@BodyParams() input: mod.writeRequest): Promise<String> {

        // write Equilibrium Expression data

        const temp_eq = {
            "expression_string": input.equilibriumExpressionInfo.expression_string,
            "products": input.equilibriumExpressionInfo.products,
            "reactants": input.equilibriumExpressionInfo.reactants
        }
        console.log("temp_eq", temp_eq)
        var eq_expr_id = await this.getId('equilibrium_expressions_user_gen', temp_eq);
        if (!eq_expr_id) {
            await this.writeDB('equilibrium_expressions_user_gen', input.equilibriumExpressionInfo);
            eq_expr_id = await this.getId('equilibrium_expressions_user_gen', temp_eq);
            await WriterDataSource
                .createQueryBuilder()
                .update(LiteratureMapping_ug)
                .set({
                    VLigandMetalLitID: () => 'id'
                })
                .where("id = :id", { id: eq_expr_id })
                .execute()
        }
        console.log("eq_expr_id:", eq_expr_id)

        return "test complete!"
    }

    // Queries the given table for an entry that matches the parameters given.
    // Returns the id column of the found row, if there was one; if not, returns null
    // (note that this will return null if the table has no id column, even if a row is found)
    async getId(table: string, valuesCheckAgainst: {[s: string]: any}) {
        var retstring = '';
        for (const key in valuesCheckAgainst)
        {
            if (valuesCheckAgainst[key] != null) {
                const keystring = key as string
                retstring += keystring + " = :" + keystring + " AND "
            } else {
                delete valuesCheckAgainst[key]
            }
        }
        if (retstring.length >= 5) {
            retstring = retstring.slice(0, -5);
        }
        var result = null;
        try {
            result = await WriterDataSource
                .getRepository(tables[table])
                .createQueryBuilder()
                .where(retstring, valuesCheckAgainst)
                .getOne()
        } catch (QueryFailedError) {
            return null;
        }

        if (result && result.id) {
            return result.id;
        } else {
            return null;
        }
    }

    // writes to the database. Simple and sweet
    async writeDB(table: string, valuesToInsert: {[s:string]: any}) {
        await WriterDataSource
            .getRepository(tables[table])
            .createQueryBuilder()
            .insert()
            .values(valuesToInsert)
            .execute()
    }
}
