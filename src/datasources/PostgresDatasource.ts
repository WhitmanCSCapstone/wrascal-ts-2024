import { registerProvider } from "@tsed/di";
import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";
// Entities
import { Condition } from "./entities/Condition";
import { Constant } from "./entities/Constant";
import { EquilibriumExpression } from "./entities/EquilibriumExpression";
import { FootNote } from "./entities/Footnote";
import { Ligand } from "./entities/Ligand";
import { Metal } from "./entities/Metal";
import { LigandMapping } from "./entities/LigandMapping";
import { Literature } from "./entities/Literature";
import { LiteratureMapping } from "./entities/LiteratureMapping";
import { MolData } from "./entities/MolData";

export const POSTGRES_DATA_SOURCE = Symbol.for("PostgresDataSource");
export const PostgresDataSource = new DataSource({
  type: "postgres",
  entities: [Condition, Constant, EquilibriumExpression, FootNote, Ligand, Metal, Literature, LigandMapping, LiteratureMapping, MolData],
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  schema: process.env.DB_SCHEMA,
  ssl: true
});

registerProvider<DataSource>({
  provide: POSTGRES_DATA_SOURCE,
  type: "typeorm:datasource",
  deps: [Logger],
  async useAsyncFactory(logger: Logger) {
    await PostgresDataSource.initialize();

    logger.info("Connected with typeorm to database: Postgres");

    return PostgresDataSource;
  },
  hooks: {
    $onDestroy(dataSource) {
      return dataSource.isInitialized && dataSource.close();
    }
  }
});
