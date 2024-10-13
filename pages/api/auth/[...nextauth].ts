import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import prisma from "../../../lib/prisma"; 
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Récupération des variables d'environnement
const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;
const googleId = process.env.GOOGLE_ID;
const googleSecret = process.env.GOOGLE_SECRET;

if (!githubId || !githubSecret || !googleId || !googleSecret) {
    throw new Error('Missing Environment variables for authentication');
}

export const authConfig: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development', // Activer le debug seulement en développement
    providers: [
        GithubProvider({
            clientId: githubId,
            clientSecret: githubSecret,
            authorization: {
                params: {
                    redirect_uri: 'https://next-js-user-application.vercel.app/api/auth/callback/github',
                },
            },
        }),
        GoogleProvider({
            clientId: googleId,
            clientSecret: googleSecret,
            authorization: {
                params: {
                    redirect_uri: 'https://next-js-user-application.vercel.app/api/auth/callback/google',
                    scope: 'profile email', // Notez que 'scope' est utilisé ici, pas 'scopes'
                },
            },
        }),
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, user }) { // Assurez-vous que la fonction est asynchrone
            if (session.user) {
                session.user.id = user.id; // Stocker l'ID utilisateur dans la session
            }
            return session; // Retourner la session, même en cas d'erreur
        },
    },
};

export default NextAuth(authConfig);
