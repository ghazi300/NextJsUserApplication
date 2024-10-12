import { getServerSession } from "next-auth"
import { authConfig } from "../pages/api/auth/[...nextauth]"

export const getAuthSesion = () => {
    return getServerSession(authConfig);
}

export const getRequiredAuthSesion = async () => {
    const session = await getAuthSesion();
    if (!session?.user) {
        throw new Error('Session not found');
    }
    return session;
}
