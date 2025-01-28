import { useState } from 'react';
import { TextField, Button, Typography, Container, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useSession } from '../../lib/SessionContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();
  const { setSession } = useSession();

  const handleLogin = async () => {
    // Validate input
    if (!email || !password) {
      setMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true); // Start loading
    setMessage(''); // Clear previous messages

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful! Redirecting...');

        // Set the session using the user object returned by the API
        setSession(data.user);

        // Navigate to the profile page after a short delay
        setTimeout(() => {
          router.push('/profile');
        }, 1500); // 1.5 seconds delay for better UX
      } else {
        setMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Container maxWidth="sm" sx={{ my: '4rem' }}>
      <Typography variant="h4" gutterBottom align="center">
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
        required
      />
      <TextField
        fullWidth
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
        required
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        disabled={isLoading} // Disable button while loading
        sx={{ mt: 3, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
      {message && (
        <Typography
          variant="body1"
          color={message.includes('success') ? 'success.main' : 'error'}
          align="center"
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Container>
  );
};

export default Login;