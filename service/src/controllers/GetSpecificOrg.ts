import { Request, Response } from "express";
import { db } from "../db";
import { organization, orgDetail} from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const getOrgById = async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = parseInt(req.params.orgId);
    if (isNaN(orgId)) {
      res.status(400).json({ error: "Invalid organization ID" });
      return;
    }

    // Fetch organization with nested relations manually
    const org = await db.query.organization.findFirst({
      where: eq(organization.id, orgId),
      with: {
        details: {
          orderBy: [desc(orgDetail.year), desc(orgDetail.term)],
          with: {
            projects: {
              with: {
                skills: {
                  with: { skill: true },
                },
              },
            },
          },
        },
      },
    });

    if (!org) {
      res.status(404).json({ error: "Organization not found" });
      return;
    }

    const result = {
      id: org.id,
      name: org.name,
      description: org.description,
      logoUrl: org.logoUrl,
      yearWiseTerms: org.details.map((detail) => ({
        year: detail.year,
        term: detail.term,
        projects: detail.projects.map((p) => ({
          id: p.id,
          title: p.title,
          upstreamIssue: p.upstreamIssue,
          lfxUrl: p.lfxUrl,
          skills: p.skills.map((ps) => ps.skill.name),
        })),
      })),
    };

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
