import { getServerSession } from "next-auth";
import { authConfig } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authConfig);

    if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    if (req.method === "GET") {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).json({ error: "Failed to fetch user" });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
