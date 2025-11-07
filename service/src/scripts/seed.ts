import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import { Pool } from 'pg';
import * as fs from 'fs';
import path from 'path';
import * as schema from '../drizzle/schema';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  console.log('Starting seed process...');

  const dataDir = path.join(__dirname, '../../data');

  // Map table names to schema exports (keep your original order for inserts)
  const tables: Record<string, any> = {
    Organization: schema.organization,
    OrgDetail: schema.orgDetail,
    Project: schema.project,
    Skill: schema.skill,
    ProjectSkill: schema.projectSkill,
  };

  // 1) TRUNCATE all tables (children first; CASCADE also covers dependencies)
  console.log('🧹 Truncating tables...');
  await db.transaction(async (tx) => {
    await tx.execute(sql`
      TRUNCATE TABLE
        ${schema.projectSkill},
        ${schema.orgDetail},
        ${schema.project},
        ${schema.skill},
        ${schema.organization}
      RESTART IDENTITY CASCADE
    `);

    // 2) Reseed inside the same transaction
    for (const [tableName, tableSchema] of Object.entries(tables)) {
      const filePath = path.join(dataDir, `${tableName}.json`);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found: ${filePath}`);
        continue;
      }

      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log(`→ Inserting ${content.length} rows into ${tableName}`);

      for (const record of content) {
        try {
          // onConflictDoNothing is harmless now, but keeps idempotency if you remove TRUNCATE later
          await tx.insert(tableSchema).values(record).onConflictDoNothing();
        } catch (err) {
          console.error(`⚠️ Failed inserting into ${tableName}`, err);
        }
      }
    }
  });

  console.log('✅ Seeding complete.');
  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed', err);
  process.exit(1);
});
