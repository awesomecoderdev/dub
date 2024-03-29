import { withProjectAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default withProjectAuth(async (req, res, project) => {
  // GET /api/projects/[slug]/users – get users for a specific project
  if (req.method === "GET") {
    const { id: projectId } = project;
    const users = await prisma.projectUsers.findMany({
      where: {
        projectId,
      },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdAt: true,
      },
    });
    return res.status(200).json(
      users.map((u) => ({
        ...u.user,
        joinedAt: u.createdAt,
      })),
    );
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
});
