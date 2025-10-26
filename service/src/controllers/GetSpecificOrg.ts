import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export const getOrgById = (prisma: PrismaClient) => async (req: Request, res: Response): Promise<void> => {
    try {
    const orgId = parseInt(req.params.orgId);
    if (isNaN(orgId)) {
     res.status(400).json({ error: "Invalid organization ID" });
        return;
    }

    // Fetch organization with its OrgDetails -> Projects -> Skills
    const organization = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        details: {
          orderBy: [{ year: "desc" }, { term: "desc" }],
          include: {
            projects: {
              include: {
                skills: {
                  include: { skill: true },
                },
              },
            },
          },
        },
      },
    });

    if (!organization) {
     res.status(404).json({ error: "Organization not found" });
        return;
    }

    // Transform response for cleaner frontend structure
    const result = {
      id: organization.id,
      name: organization.name,
      description: organization.description,
      logoUrl: organization.logoUrl,
      yearWiseTerms: organization.details.map((detail : any) => ({
        year: detail.year,
        term: detail.term,
        projects: detail.projects.map((p : any) => ({
          id: p.id,
          title: p.title,
          upstreamIssue: p.upstreamIssue,
          lfxUrl: p.lfxUrl,
          skills: p.skills.map((ps : any) => ps.skill.name),
        })),
      })),
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
