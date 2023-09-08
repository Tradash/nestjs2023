import { DataSource } from "typeorm";
import config from "./ormconfig";

const dataSource = new DataSource(config)
dataSource.initialize()
export default dataSource