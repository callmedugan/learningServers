import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema.js";
import { config, envVariables } from "../config.js";

//create db var
const conn = postgres(envVariables.dbURL);
export const db = drizzle(conn, { schema });
