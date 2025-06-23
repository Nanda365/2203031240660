import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logAction } from '../middleware/logger';
import { CircularProgress, Container, Typography } from '@mui/material';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem('shortLinks')) || [];
    const match = links.find(link => link.code === shortcode);

    if (!match) {
      setStatus('notfound');
      logAction('SHORTCODE_NOT_FOUND', { shortcode });
      return;
    }

    const now = Date.now();
    if (now > match.expiresAt) {
      setStatus('expired');
      logAction('SHORTCODE_EXPIRED', { shortcode });
      return;
    }

    // Log the click
    const updatedLinks = links.map(link => {
      if (link.code === shortcode) {
        link.clicks.push({
          timestamp: new Date().toISOString(),
          referrer: document.referrer || 'direct',
          location: 'N/A' // Location is mocked for now
        });
        logAction('SHORTCODE_CLICKED', {
          shortcode,
          referrer: document.referrer || 'direct'
        });
      }
      return link;
    });

    localStorage.setItem('shortLinks', JSON.stringify(updatedLinks));

    // Redirect after brief delay
    setTimeout(() => {
      window.location.href = match.url;
    }, 1000);
  }, [shortcode]);

  if (status === 'checking') {
    return (
      <Container>
        <Typography variant="h6" gutterBottom>Redirecting...</Typography>
        <CircularProgress />
      </Container>
    );
  }

  if (status === 'notfound') {
    return (
      <Container>
        <Typography variant="h6" color="error">Short URL not found.</Typography>
      </Container>
    );
  }

  if (status === 'expired') {
    return (
      <Container>
        <Typography variant="h6" color="error">This link has expired.</Typography>
      </Container>
    );
  }

  return null;
};

export default RedirectHandler;
