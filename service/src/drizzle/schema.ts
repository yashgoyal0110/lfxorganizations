import { pgTable, varchar, timestamp, text, integer, uniqueIndex, index, serial, foreignKey, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const prismaMigrations = pgTable("_prisma_migrations", {
	id: varchar({ length: 36 }).primaryKey().notNull(),
	checksum: varchar({ length: 64 }).notNull(),
	finishedAt: timestamp("finished_at", { withTimezone: true, mode: 'string' }),
	migrationName: varchar("migration_name", { length: 255 }).notNull(),
	logs: text(),
	rolledBackAt: timestamp("rolled_back_at", { withTimezone: true, mode: 'string' }),
	startedAt: timestamp("started_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	appliedStepsCount: integer("applied_steps_count").default(0).notNull(),
});

export const organization = pgTable("Organization", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	logoUrl: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("Organization_logoUrl_key").using("btree", table.logoUrl.asc().nullsLast().op("text_ops")),
	index("Organization_name_idx").using("btree", table.name.asc().nullsLast().op("text_ops")),
	uniqueIndex("Organization_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const orgDetail = pgTable("OrgDetail", {
	id: serial().primaryKey().notNull(),
	orgId: integer().notNull(),
	year: integer().notNull(),
	term: integer().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("OrgDetail_orgId_year_term_key").using("btree", table.orgId.asc().nullsLast().op("int4_ops"), table.year.asc().nullsLast().op("int4_ops"), table.term.asc().nullsLast().op("int4_ops")),
	index("OrgDetail_year_term_idx").using("btree", table.year.asc().nullsLast().op("int4_ops"), table.term.asc().nullsLast().op("int4_ops")),
	foreignKey({
		columns: [table.orgId],
		foreignColumns: [organization.id],
		name: "OrgDetail_orgId_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const project = pgTable("Project", {
	id: serial().primaryKey().notNull(),
	orgId: integer().notNull(),
	orgDetailId: integer().notNull(),
	title: text().notNull(),
	upstreamIssue: text(),
	lfxUrl: text(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	index("Project_orgDetailId_idx").using("btree", table.orgDetailId.asc().nullsLast().op("int4_ops")),
	index("Project_orgId_idx").using("btree", table.orgId.asc().nullsLast().op("int4_ops")),
	foreignKey({
		columns: [table.orgId],
		foreignColumns: [organization.id],
		name: "Project_orgId_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
		columns: [table.orgDetailId],
		foreignColumns: [orgDetail.id],
		name: "Project_orgDetailId_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
]);

export const skill = pgTable("Skill", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("Skill_name_key").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const projectSkill = pgTable("ProjectSkill", {
	projectId: integer().notNull(),
	skillId: integer().notNull(),
	createdAt: timestamp({ precision: 3, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp({ precision: 3, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
		columns: [table.projectId],
		foreignColumns: [project.id],
		name: "ProjectSkill_projectId_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
		columns: [table.skillId],
		foreignColumns: [skill.id],
		name: "ProjectSkill_skillId_fkey"
	}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.projectId, table.skillId], name: "ProjectSkill_pkey" }),
]);
