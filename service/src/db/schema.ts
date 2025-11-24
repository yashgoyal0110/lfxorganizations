import { pgTable, serial, varchar, text, integer, timestamp, unique, index, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const organization = pgTable("Organization", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  description: text("description"),
  logoUrl: varchar("logoUrl", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (t) => ({
  nameIdx: index("organization_name_idx").on(t.name),
}));

export const orgDetail = pgTable("OrgDetail", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").references(() => organization.id, { onDelete: "cascade" }).notNull(),
  year: integer("year").notNull(),
  term: integer("term").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (t) => ({
  uniq: unique("org_year_term_unique").on(t.orgId, t.year, t.term),
  yearTermIdx: index("orgdetail_year_term_idx").on(t.year, t.term),
}));

export const project = pgTable("Project", {
  id: serial("id").primaryKey(),
  orgId: integer("orgId").references(() => organization.id, { onDelete: "cascade" }).notNull(),
  orgDetailId: integer("orgDetailId").references(() => orgDetail.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  upstreamIssue: text("upstreamIssue"),
  lfxUrl: text("lfxUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (t) => ({
  orgIdx: index("project_org_idx").on(t.orgId),
  orgDetailIdx: index("project_orgdetail_idx").on(t.orgDetailId),
}));

export const skill = pgTable("Skill", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const projectSkill = pgTable("ProjectSkill", {
  projectId: integer("projectId").references(() => project.id, { onDelete: "cascade" }).notNull(),
  skillId: integer("skillId").references(() => skill.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.projectId, t.skillId] }),
}));

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userName: varchar("username", { length: 255 }).unique().notNull(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoggedAt: timestamp("last_logged_at"),
});

// Relations
export const orgRelations = relations(organization, ({ many }) => ({
  details: many(orgDetail),
  projects: many(project),
}));

export const orgDetailRelations = relations(orgDetail, ({ one, many }) => ({
  org: one(organization, { fields: [orgDetail.orgId], references: [organization.id] }),
  projects: many(project),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  org: one(organization, { fields: [project.orgId], references: [organization.id] }),
  orgDetail: one(orgDetail, { fields: [project.orgDetailId], references: [orgDetail.id] }),
  skills: many(projectSkill),
}));

export const projectSkillRelations = relations(projectSkill, ({ one }) => ({
  project: one(project, { fields: [projectSkill.projectId], references: [project.id] }),
  skill: one(skill, { fields: [projectSkill.skillId], references: [skill.id] }),
}));
