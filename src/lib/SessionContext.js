// context/SessionContext.js
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
        setSession(decoded);
      } catch (error) {
        console.error('Invalid token:', error);
        setSession(null);
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
