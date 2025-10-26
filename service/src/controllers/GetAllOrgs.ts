import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";


export const getAllOrgs = (prisma: PrismaClient) => async (req: Request, res: Response): Promise<void> => {
    try {

        const orgs = await prisma.organization.findMany({
            include: {
                details: { select: { year: true, term: true } },
                _count: { select: { projects: true } },
            },
        });

        const formatted = orgs.map((org : any) => ({
            id: org.id,
            name: org.name,
            years: [...new Set(org.details.map((d : any) => d.year))],
            logoUrl: org.logoUrl,
            description: org.description,
            totalProjects: org._count.projects,
        }));

        res.status(200).json(formatted);
        return;
    } catch (err) {
        console.error("Error fetching home data:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
};
