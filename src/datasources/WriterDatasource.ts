import { registerProvider } from "@tsed/di";
import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";
import { Metals_ug } from "src/datasources/entities/Metal";
import { Ligands_ug } from "./entities/Ligand";
import { Conditions_ug } from "./entities/Condition"
import { EquilibriumExpression_ug } from "./entities/EquilibriumExpression";
//import { Metal_User_Gen } from "./entities/Metal_User_Gen";

export const WRITER_DATA_SOURCE = Symbol.for("WriterDataSource");
export const WriterDataSource = new DataSource({
  type: "postgres",
  entities: [Conditions_ug, Metals_ug, Ligands_ug, EquilibriumExpression_ug],
  host: 'aws-0-us-west-1.pooler.supabase.com',
  port: 5432,
  username: 'postgres.eauyarvlibdxezijtoyx',
  password: 'QQDfWWErfbeYvumh',
  database: "postgres",
  schema: "public"
});

registerProvider<DataSource>({
    provide: WRITER_DATA_SOURCE,
    type: "typeorm:datasource",
    deps: [Logger],
    async useAsyncFactory(logger: Logger) {
      await WriterDataSource.initialize();
  
      logger.info("beep boop connected to writer");
  
      return WRITER_DATA_SOURCE;
    },
    hooks: {
      $onDestroy(dataSource) {
        return dataSource.isInitialized && dataSource.close();
      }
    }
  });
