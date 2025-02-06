"use client";

import { useState } from "react";
import { TextField, Button, Alert, Container, Typography, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("General Inquiry"); // Default topic
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, topic, message }),
    });

    if (res.status === 200) {
      setStatus("success");
      setName("");
      setEmail("");
      setTopic("General Inquiry");
      setMessage("");
    } else {
      setStatus("error");
    }
  };

  return (
    <Container maxWidth="sm" className="bg-white shadow-lg rounded-2xl p-6">
      {/* Title */}
      <Typography variant="h5" className="text-center font-semibold text-gray-800 mb-4">
        Contact Us
      </Typography>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name Field */}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email Field */}
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Topic Dropdown */}
        <FormControl fullWidth>
          <InputLabel>Topic</InputLabel>
          <Select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <MenuItem value="General Inquiry">General Inquiry</MenuItem>
            <MenuItem value="Route Suggestion">Route Suggestion</MenuItem>
          </Select>
        </FormControl>

        {/* Message Field */}
        <TextField
          label="Message"
          variant="outlined"
          fullWidth
          required
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Send Message
        </Button>
      </form>

      {/* Status Message */}
      {status && (
        <Box mt={3}>
          <Alert severity={status === "success" ? "success" : "error"}>
            {status === "success" ? "Email sent successfully!" : "Failed to send email."}
          </Alert>
        </Box>
      )}
    </Container>
  );
}
