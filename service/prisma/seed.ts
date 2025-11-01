import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

// ✅ Converts date strings like "2025-10-27 07:30:27.937" → valid Date objects
function convertDates(data: any): any {
  if (Array.isArray(data)) {
    return data.map((item) => convertDates(item));
  }

  if (typeof data === "object" && data !== null) {
    const converted: Record<string, any> = {};
    for (const key in data) {
      const value = data[key];
      if (
        (key === "createdAt" || key === "updatedAt") &&
        typeof value === "string"
      ) {
        // Replace space with 'T' and add 'Z' to make it ISO-8601
        converted[key] = new Date(value.replace(" ", "T") + "Z");
      } else if (typeof value === "object") {
        converted[key] = convertDates(value);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  }

  return data;
}

async function main() {
  console.log("🌱 Starting seed process...");

  const skills = convertDates(JSON.parse(fs.readFileSync("./prisma/Skill.json", "utf-8")));
  const organizations = convertDates(JSON.parse(fs.readFileSync("./prisma/Organization.json", "utf-8")));
  const orgDetails = convertDates(JSON.parse(fs.readFileSync("./prisma/OrgDetail.json", "utf-8")));
  const projects = convertDates(JSON.parse(fs.readFileSync("./prisma/Project.json", "utf-8")));
  const projectSkills = convertDates(JSON.parse(fs.readFileSync("./prisma/ProjectSkill.json", "utf-8")));

  await prisma.skill.createMany({ data: skills, skipDuplicates: true });
  await prisma.organization.createMany({ data: organizations, skipDuplicates: true });
  await prisma.orgDetail.createMany({ data: orgDetails, skipDuplicates: true });
  await prisma.project.createMany({ data: projects, skipDuplicates: true });
  await prisma.projectSkill.createMany({ data: projectSkills, skipDuplicates: true });

  console.log("✅ Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0); // 👈 clean exit for Docker
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
