import { getServerSession } from "next-auth";
import { authConfig } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authConfig);

    if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    if (req.method === "PUT") {
        const { name, address, birthDate, phoneNumber } = req.body;

        let formattedBirthDate: string | undefined;
        if (birthDate) {
            const date = new Date(birthDate);
            if (isNaN(date.getTime())) {
                return res.status(400).json({ error: "Invalid birth date format" });
            }
            formattedBirthDate = date.toISOString();
        }

        try {
            const user = await prisma.user.update({
                where: { id: userId },  // ObjectId dans MongoDB
                data: {
                    name,
                    address,
                    birthDate: formattedBirthDate,
                    phoneNumber,
                },
            });
            return res.status(200).json(user);
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ error: "Failed to update user" });
        }
    } else {
        res.setHeader("Allow", ["PUT"]);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
