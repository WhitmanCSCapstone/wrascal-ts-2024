import { registerProvider } from "@tsed/di";
import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";
import { Metal_ug } from "src/datasources/entities/Metal";
import { Ligand_ug } from "./entities/Ligand";
//import { Metal_User_Gen } from "./entities/Metal_User_Gen";

export const WRITER_DATA_SOURCE = Symbol.for("WriterDataSource");
export const WriterDataSource = new DataSource({
  type: "postgres",
  entities: [Metal_ug, Ligand_ug],
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