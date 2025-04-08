"use client";
import { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Alert, 
  Container, 
  Typography, 
  Box, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel,
  CircularProgress,
  Snackbar,
  Paper,
  Grid,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { 
  Send as SendIcon,
  ContactSupport as ContactIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Category as CategoryIcon
} from "@mui/icons-material";

// Custom styles
const formStyles = {
  inputField: {
    marginBottom: 2,
  },
  submitButton: {
    marginTop: 2,
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    }
  },
  formContainer: {
    transition: 'all 0.3s ease-in-out',
    borderRadius: '16px',
    overflow: 'hidden',
  }
};

export default function ContactForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "General Inquiry",
    message: ""
  });
  
  // Form submission state
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark form as touched on first interaction
    if (!formTouched) {
      setFormTouched(true);
    }
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setStatus("");
    
    try {
      // Add a small delay to show loading state (for demo purposes)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.status === 200) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          topic: "General Inquiry",
          message: ""
        });
        setFormTouched(false);
        setShowSnackbar(true);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setStatus("error");
        if (errorData.message) {
          setErrors({ submit: errorData.message });
        } else {
          setErrors({ submit: "Failed to send message. Please try again later." });
        }
      }
    } catch (error) {
      setStatus("error");
      setErrors({ submit: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  // Clear status after 5 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Calculate if form is valid (for button state)
  const isFormValid = formTouched && 
    formData.name.trim().length >= 2 && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && 
    formData.message.trim().length >= 10;

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={6} 
        sx={{
          ...formStyles.formContainer,
          padding: isMobile ? 2 : 4,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #2d2d2d, #3d3d3d)'
            : 'linear-gradient(145deg, #ffffff, #f5f5f5)'
        }}
      >
        <Grid container spacing={3}>
          {/* Left side - Title and info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" alignItems="center" mb={2}>
                <ContactIcon color="primary" fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="h5" component="h1" fontWeight="bold" color="primary">
                  Contact Us
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph color="textSecondary" sx={{ mb: 3 }}>
                We&quot;d love to hear from you! Fill out the form and our team will get back to you as soon as possible.
              </Typography>
              
              {!isMobile && (
                <>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ flexGrow: 1 }} />
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Our team typically responds within 24-48 hours during business days.
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
          
          {/* Divider for desktop */}
          {!isMobile && (
            <Grid item xs={12} md={1}>
              <Divider orientation="vertical" sx={{ height: '100%', mx: 'auto' }} />
            </Grid>
          )}
          
          {/* Right side - Form */}
          <Grid item xs={12} md={7}>
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <Box sx={formStyles.inputField}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={Boolean(errors.name)}
                  helperText={errors.name || ""}
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                    "aria-label": "Your name",
                    sx: { borderRadius: '8px' }
                  }}
                  inputProps={{ maxLength: 100 }}
                />
              </Box>
              
              {/* Email Field */}
              <Box sx={formStyles.inputField}>
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  helperText={errors.email || ""}
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                    "aria-label": "Your email address",
                    sx: { borderRadius: '8px' }
                  }}
                />
              </Box>
              
              {/* Topic Dropdown */}
              <Box sx={formStyles.inputField}>
                <FormControl fullWidth>
                  <InputLabel id="topic-select-label">Topic</InputLabel>
                  <Select
                    labelId="topic-select-label"
                    value={formData.topic}
                    name="topic"
                    label="Topic"
                    onChange={handleChange}
                    disabled={isSubmitting}
                    startAdornment={<CategoryIcon color="action" sx={{ mr: 1, ml: -0.5 }} />}
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                    <MenuItem value="Route Suggestion">Route Suggestion</MenuItem>
                    <MenuItem value="Technical Support">Technical Support</MenuItem>
                    <MenuItem value="Feedback">Feedback</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {/* Message Field */}
              <Box sx={formStyles.inputField}>
                <TextField
                  label="Message"
                  variant="outlined"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={Boolean(errors.message)}
                  helperText={errors.message || ""}
                  disabled={isSubmitting}
                  InputProps={{
                    startAdornment: (
                      <MessageIcon color="action" sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                    ),
                    sx: { borderRadius: '8px' }
                  }}
                  inputProps={{ 
                    "aria-label": "Your message",
                    maxLength: 1000
                  }}
                />
              </Box>
              
              {/* Character count for message */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color={
                  formData.message.length > 900 ? "error" : 
                  formData.message.length > 700 ? "warning.main" : "textSecondary"
                }>
                  {formData.message.length}/1000 characters
                </Typography>
                
                {formData.message.length < 10 && formTouched && (
                  <Typography variant="caption" color="textSecondary">
                    At least {10 - formData.message.length} more character(s) needed
                  </Typography>
                )}
              </Box>
              
              {/* Submit Error */}
              {errors.submit && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: '8px' }}>
                  {errors.submit}
                </Alert>
              )}
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={isSubmitting || !isFormValid}
                endIcon={isSubmitting ? null : <SendIcon />}
                sx={formStyles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress 
                      size={24} 
                      color="inherit" 
                      sx={{ mr: 1 }} 
                    />
                    Sending...
                  </>
                ) : "Send Message"}
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Success Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
          iconMapping={{
            success: <SendIcon fontSize="inherit" />
          }}
        >
          Thank you! Your message has been sent successfully.
        </Alert>
      </Snackbar>
    </Container>
  );
}