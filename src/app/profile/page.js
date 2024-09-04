'use client'
import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, CardActions } from '@mui/material';
import Link from 'next/link';
import PostListPage from '../components/PostList';
// import RouteList from '../../components/RouteList';

export default function ManagePage() {
  return (
    <Container maxWidth="md" style={{ padding: '4rem 0' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Your Content
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <PostListPage  />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Routes
          </Typography>
          <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/map/edit" 
            >
              Add Routes
            </Button>
          {/* <RouteList routes={routes} /> */}
        </Grid>
      </Grid>
    </Container>
  );
}
