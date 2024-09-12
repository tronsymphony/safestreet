import { createContext, useContext, useState, useEffect } from 'react';
import cookie from 'js-cookie';
import jwt from 'jsonwebtoken';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const token = cookie.get('token');
    
    if (token) {
      try {
        const decoded = jwt.decode(token);

        // Check if the token has expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.log('Token has expired');
          setSession(null);
          cookie.remove('token'); // Remove the expired token
        } else {
          setSession(decoded); // Token is valid, set the session
        }
      } catch (error) {
        console.error('Invalid token:', error);
        setSession(null);
        cookie.remove('token'); // Remove the invalid token
      }
    }
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
