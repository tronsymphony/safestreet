import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";


// Hash the password using bcrypt
const plainPassword = "password123";
const saltRounds = 12; // Should match the number of rounds used for the hashed password
const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds);

console.log("Hashed password:", hashedPassword);


const users = [
    {
        id: 1,
        email: "test@example.com",
        password: hashedPassword, // hashed password: 'password123'
    },
];

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password", placeholder: "Password" },
            },
            async authorize(credentials) {
                // Log credentials received to check
                console.log("Received credentials:", credentials);

                // Find user based on email
                const user = users.find((u) => u.email === credentials.email);
                if (!user) {
                    console.log("User not found");
                    return null; // User not found
                }

                // Check password
                const isValid = bcrypt.compareSync(credentials.password, user.password);
                if (!isValid) {
                    console.log("Invalid password", credentials.password, user.password, isValid);
                    return null; // Invalid password
                }

                // Return user if email and password are valid
                console.log("Authentication successful");
                return { id: user.id, email: user.email };
            },
        }),
    ],
    pages: {
        signIn: "/login",  // Custom login page (explained below)
    },
    session: {
        strategy: "jwt", // Use JWT for sessions stored in cookies
    },
    jwt: {
        secret: process.env.JWT_SECRET,  // Secret for signing JWT tokens
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.id = token.id;
            return session;
        },
    },
});
