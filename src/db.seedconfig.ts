import { DataSource } from "typeorm";
import config from "./ormseedconfig";

const dataSource = new DataSource(config)
dataSource.initialize()
export default dataSource