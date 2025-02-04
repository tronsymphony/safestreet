import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import pool from '../../../lib/db'; // Your existing database connection

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {
                console.log("🔍 Checking user:", credentials.email);
            
                const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [credentials.email]);
            
                if (userResult.rows.length === 0) {
                    console.error("❌ User not found:", credentials.email);
                    throw new Error("User not found");
                }
            
                const user = userResult.rows[0];
            
                console.log("🔍 Checking password for user:", user.email);
                console.log("🔐 Stored password:", user.password); // Log stored password
                console.log("🔑 Entered password:", credentials.password);
            
                const isMatch = await bcrypt.compare(credentials.password, user.password);
                console.log("🔄 Password Match Status:", isMatch);
            
                if (!isMatch) {
                    console.error("❌ Invalid password for user:", credentials.email);
                    throw new Error("Invalid password");
                }
            
                console.log("✅ Authentication successful:", credentials.email);
                return { id: user.id, email: user.email, role: user.role };
            }
            

        }),
    ],
    pages: {
        signIn: "/login",  // Custom login page
    },
    session: {
        strategy: "jwt", // Use JWT for sessions stored in cookies
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        // secret: process.env.NEXTAUTH_SECRET,  // Ensure this is set in your environment variables
    },
    debug: true,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role; // Include role in the JWT payload
            }
            return token;
        },
        async session({ session, token }) {
            session.id = token.id;
            session.role = token.role; // Pass role to the session object
            return session;
        },
    },
});
