import { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from '../../lib/SessionContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { setSession } = useSession();

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Login successful');
      
      // Assuming the server sends the JWT token in the response (or other user data)
      const { token, user } = data; 
      
      // Set the session using the user object returned by the API
      setSession(user);

      // Navigate to the profile page
      router.push('/profile');
    } else {
      setMessage(data.message || 'Login failed'); // Show error message
    }
  };

  return (
    <Container maxWidth="lg" sx={{ my: '4rem' }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        style={{ marginTop: '16px' }}
      >
        Login
      </Button>
      {message && (
        <Typography variant="body1" color="error" style={{ marginTop: '16px' }}>
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Login;
