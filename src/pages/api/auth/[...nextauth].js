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
                const { email, password } = credentials;

                try {
                    // Check if the user exists in the database
                    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

                    if (userResult.rows.length === 0) {
                        console.log("User not found");
                        return null; // Return null if the user doesn't exist
                    }

                    const user = userResult.rows[0];

                    // Check if the password is correct using bcrypt.compare
                    const isMatch = await bcrypt.compare(password, user.password);

                    if (!isMatch) {
                        console.log("Invalid password");
                        return null; // Return null if the password is incorrect
                    }

                    // Return user object (will be stored in JWT token)
                    return { id: user.id, email: user.email, role: user.role };
                } catch (error) {
                    console.error("Error during user authentication:", error);
                    return null; // Return null in case of error
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",  // Custom login page
    },
    session: {
        strategy: "jwt", // Use JWT for sessions stored in cookies
    },
    jwt: {
        secret: process.env.JWT_SECRET,  // Ensure this is set in your environment variables
    },
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
