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
    debug: true, // Cela activera des journaux supplémentaires pour aider à déboguer
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
    },
    events: {
        async signIn(message) {
            console.log("User signed in:", message);
        },
        async signOut(message) {
            console.log("User signed out:", message);
        },
        async error(message) {
            console.error("Error occurred during authentication:", message);
        },
        async redirect(url, baseUrl) {
            console.log(`Redirecting to ${url} from ${baseUrl}`);
        }
    },
    pages: {
        error: '/auth/error' // Rediriger vers une page d'erreur personnalisée si nécessaire
    }
} satisfies NextAuthOptions;

export default NextAuth(authConfig);
