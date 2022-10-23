import {Controller, Inject, Injectable} from "@tsed/di";
import {Get} from "@tsed/schema";
import {POSTGRES_DATA_SOURCE} from "../../../datasources/PostgresDatasource";
import {DataSource} from "typeorm";
import {QueryParams} from "@tsed/platform-params";
import {Constant} from "../../../datasources/entities/Constant";

@Injectable()
@Controller("/db")
export class SearchController {
    @Inject(POSTGRES_DATA_SOURCE)
    protected dataSource: DataSource;

    $onInit() {
        if (this.dataSource.isInitialized) {
            console.log("POSTGREDB DATASOURCE INIT");
        }
    }

    @Get("/search/ligand")
    async searchByLigand(@QueryParams("ligand") ligand: string): Promise<string> {
        const result =
            await this.dataSource
                .getRepository(Constant)
                .createQueryBuilder()
                .select(["central_element", "ligand_id", "metal_id"])
                .addSelect("ligands.name", "name")
                .addSelect("ligands.charge", "ligand_charge")
                .addSelect("metals.charge", "metal_charge")
                .innerJoin("ligands", "ligands", "ligand_id = ligands.id")
                .innerJoin("metals", "metals", "metal_id = metals.id")
                .where(`name iLike '%${ligand}%'`)
                .getRawMany();
        return JSON.stringify(result);
    }

    @Get("/search/advance")
    advanceSearch() {
        return "";
    }

    @Get("/constants")
    getConstants(){
        return "";
    }
}
