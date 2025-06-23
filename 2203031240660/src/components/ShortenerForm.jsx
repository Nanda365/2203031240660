import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { logAction } from '../middleware/logger';
import validateURL from '../utils/validateURL';

const ShortenerForm = () => {
  const [url, setUrl] = useState('');
  const [validity, setValidity] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [shortened, setShortened] = useState(null);
  const [error, setError] = useState('');

  const handleShorten = () => {
    setError('');

    if (!validateURL(url)) {
      setError('Invalid URL format');
      logAction('URL_INVALID', { url });
      return;
    }

    const code = customCode.trim() !== '' ? customCode.trim() : uuidv4().slice(0, 6);
    const valid = validity ? parseInt(validity) : 30;
    const createdAt = Date.now();
    const expiresAt = createdAt + valid * 60 * 1000;

    const newShort = {
      code,
      url,
      createdAt,
      expiresAt,
      clicks: []
    };

    const existing = JSON.parse(localStorage.getItem('shortLinks')) || [];

    // Check for duplicate custom codes
    if (existing.find(item => item.code === code)) {
      setError('Shortcode already exists. Please try another.');
      logAction('SHORTCODE_DUPLICATE', { code });
      return;
    }

    const updated = [...existing, newShort];
    localStorage.setItem('shortLinks', JSON.stringify(updated));
    logAction('URL_SHORTENED', newShort);
    setShortened(code);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>URL Shortener</Typography>
      <Box component="form" noValidate autoComplete="off">
        <Stack spacing={2}>
          <TextField
            label="Long URL"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <TextField
            label="Validity (minutes)"
            type="number"
            fullWidth
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
          />
          <TextField
            label="Custom Shortcode (optional)"
            fullWidth
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button variant="contained" onClick={handleShorten}>Shorten</Button>
          {shortened && (
            <Typography variant="body1">
              Short URL: <a href={`/${shortened}`}>http://localhost:3000/{shortened}</a>
            </Typography>
          )}
        </Stack>
      </Box>
    </Container>
  );
};

export default ShortenerForm;
