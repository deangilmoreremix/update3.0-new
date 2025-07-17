import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../shared/schema-sqlite.js';

// Create SQLite database connection for local development
const sqlite = new Database('./smart-crm.db');
export const db = drizzle(sqlite, { schema });

export { schema };
