import { createContext, useContext, useState, useEffect } from 'react';
import cookie from 'js-cookie';
import jwt from 'jsonwebtoken';

// Create a context for session management
const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const token = cookie.get('token');

    // If a token exists, validate it
    if (token) {
      try {
        const decoded = jwt.decode(token);

        // Check if the token is valid and not expired
        if (!decoded || (decoded.exp && decoded.exp * 1000 < Date.now())) {
          console.warn('Token is invalid or expired');
          setSession(null);
          cookie.remove('token'); // Remove the invalid or expired token
        } else {
          setSession(decoded); // Token is valid, set the session
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setSession(null);
        cookie.remove('token'); // Remove the invalid token
      }
    }
  }, []);

  // Provide the session and setSession function to children
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to access the session context
export const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
};