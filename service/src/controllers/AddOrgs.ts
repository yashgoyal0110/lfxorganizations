import { Request, Response } from "express";
import { db } from "../db";
import { cachedOrgs } from "../utils/cached";
import { organization, orgDetail, project, skill, projectSkill } from "../db/schema";
import { eq, and, ilike } from "drizzle-orm";

async function findOrCreateOrganization(orgName: string) {
  const existing = await db.query.organization.findFirst({
    where: eq(organization.name, orgName),
  });

  if (existing) return existing;

  const [created] = await db.insert(organization)
    .values({ name: orgName })
    .returning();
  return created;
}

async function findOrCreateorgDetail(orgId: number, year: number, term: number) {
  const existing = await db.query.orgDetail.findFirst({
    where: and(
      eq(orgDetail.orgId, orgId),
      eq(orgDetail.year, year),
      eq(orgDetail.term, term)
    ),
  });

  if (existing) return existing;
  const [created] = await db.insert(orgDetail)
    .values({ orgId, year, term })
    .returning();
  return created;
}

async function createProject(
  orgId: number,
  orgDetailId: number,
  projectData: any
) {
  const { project: title, upstreamIssue, lfxUrl } = projectData;

  const existing = await db.query.project.findFirst({
    where: and(
      eq(project.orgDetailId, orgDetailId),
      eq(project.title, title)
    ),
  });

  if (existing) {
    return existing;
  }

  const [newProject] = await db.insert(project)
    .values({
      orgId,
      orgDetailId: orgDetailId,
      title,
      upstreamIssue,
      lfxUrl,
    })
    .returning();
  return newProject;
}

async function attachskillToProject(projectId: number, requiredskill: string[]) {
  for (const skillName of requiredskill) {
const existingSkill = await db.query.skill.findFirst({
  where: ilike(skill.name, skillName),
});

    let skillId: number;
    if (existingSkill) {
      skillId = existingSkill.id;
    } else {
      const [createdSkill] = await db.insert(skill)
        .values({ name: skillName })
        .returning();
      skillId = createdSkill.id;
    }

    await db.insert(projectSkill)
      .values({ projectId, skillId })
      .onConflictDoNothing(); // prevents duplicate linking
  }
}

export const addOrgs = async (req: Request, res: Response) => {
  console.log("Received bulk insert request");

  const project = req.body;
  if (!Array.isArray(project) || project.length === 0) {
    return res.status(400).json({ error: "Invalid input format" });
  }

  try {
    await db.transaction(async (tx) => {
      for (const p of project) {
        const { org, year: rawYear, term: rawTerm, requiredSkills = [] } = p;
        const year = parseInt(String(rawYear), 10);
        const term = parseInt(String(rawTerm), 10);

        const organization = await findOrCreateOrganization(org);
        const orgDetail = await findOrCreateorgDetail(organization.id, year, term);
        const newProject = await createProject(organization.id, orgDetail.id, p);

        if (requiredSkills.length > 0) {
          await attachskillToProject(newProject.id, requiredSkills);
        }
      }
    });

    cachedOrgs.length = 0;
    res.json({ message: `${project.length} project inserted successfully` });
  } catch (err) {
    console.error("❌ Error inserting project:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
