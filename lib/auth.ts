
import { loginUser } from "@/server/actions/auth/login";
import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const result = await loginUser({
                    email: credentials.email as string,
                    password: credentials.password as string,
                });

                if (!result.success || !result.user) {
                    throw new Error(result.error || "Login failed");
                }

                return {
                    id: result.user.id,
                    email: result.user.email,
                    name: result.user.name,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    } as const,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                (token as any).id = (user as any).id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = (token as any).id as string;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const nextAuth = NextAuth(authOptions as any);

export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const GET = nextAuth.handlers.GET;
export const POST = nextAuth.handlers.POST;