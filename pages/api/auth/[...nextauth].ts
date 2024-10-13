import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import prisma from "../../../lib/prisma"; 
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const githubId = process.env.GITHUB_ID;
const githubSecret = process.env.GITHUB_SECRET;
const googleId = process.env.GOOGLE_ID;
const googleSecret = process.env.GOOGLE_SECRET;

if (!githubId || !githubSecret || !googleId || !googleSecret) {
    throw new Error('Missing Environment variables for authentication');
}

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET,
    debug: true, // Activer les logs pour le débogage
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
                scopes: ['profile', 'email']
              },
            },
        })
    ],
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session: async ({ session, user }) => {
            try {
                if (session.user) {
                    session.user.id = user.id; // Stocker l'ID utilisateur dans la session
                }
                return session;
            } catch (error) {
                console.error("Error in session callback:", error);
                return session; // Gérer l'erreur
            }
        },
        signIn: async ({ user, account, profile, email, credentials }) => {
            // Vérifier les erreurs d'authentification ici
            if (account && account.provider === "google") {
                if (!user) {
                    console.error("Failed to sign in with Google: user not found.");
                    return false; // Refuser la connexion si l'utilisateur n'est pas trouvé
                }
            }
            return true; // Autoriser la connexion
        },
    },
    pages: {
        error: '/auth/error' // Rediriger vers une page d'erreur personnalisée si nécessaire
    }
} satisfies NextAuthOptions;

export default NextAuth(authConfig);
