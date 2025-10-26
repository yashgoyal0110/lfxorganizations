import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findOrCreateOrganization(prisma: PrismaClient, orgName: string) {
  return prisma.organization.upsert({
    where: { name: orgName },
    create: { name: orgName },
    update: {},
  });
}

async function findOrCreateOrgDetail(prisma: PrismaClient, orgId: number, year: number, term: number) {
  return prisma.orgDetail.upsert({
    where: {
      orgId_year_term: {
        orgId,
        year,
        term,
      },
    },
    create: { orgId, year, term },
    update: {},
  });
}

async function createProject(
  prisma: PrismaClient,
  orgId: number,
  orgDetailId: number,
  
  projectData: any
) {
  const { project, upstreamIssue, lfxUrl } = projectData;
  return prisma.project.create({
    data: {
      orgId,
      orgDetailId,
      title: project,
      upstreamIssue,
      lfxUrl,
    },
  });
}

async function attachSkillsToProject(prisma: PrismaClient, projectId: number, requiredSkills: string[]) {
  for (const skillName of requiredSkills) {
    const skill = await prisma.skill.upsert({
      where: { name: skillName },
      create: { name: skillName },
      update: {},
    });

    await prisma.projectSkill.create({
      data: {
        projectId,
        skillId: skill.id,
      },
    });
  }
}

export const addOrgs = (prisma: PrismaClient) => async (req: Request, res: Response) => {
  console.log("📩 Received bulk insert request");
  const projects = req.body;

  if (!Array.isArray(projects) || projects.length === 0) {
    return res.status(400).json({ error: "Invalid input format" });
  }

  try {
    await prisma.$transaction(async (tx : any) => {
      for (const p of projects) {
        const { org, project, year: rawYear, term: rawTerm, requiredSkills = [], upstreamIssue, lfxUrl } = p;

        const year = parseInt(String(rawYear), 10);
        const term = parseInt(String(rawTerm), 10);

        const organization = await findOrCreateOrganization(tx, org);

        const orgDetail = await findOrCreateOrgDetail(tx, organization.id, year, term);

        const newProject = await createProject(tx, organization.id, orgDetail.id, p);

        if (requiredSkills.length > 0) {
          await attachSkillsToProject(tx, newProject.id, requiredSkills);
        }
      }
    });

    res.json({ message: "✅ Projects inserted successfully" });
  } catch (err) {
    console.error("❌ Error inserting projects:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
