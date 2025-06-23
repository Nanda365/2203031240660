import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack
} from '@mui/material';

const StatsPage = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('shortLinks')) || [];
    setLinks(stored);
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>
      <Stack spacing={3}>
        {links.length === 0 && (
          <Typography>No shortened URLs yet.</Typography>
        )}

        {links.map(link => (
          <Card key={link.code} elevation={3}>
            <CardContent>
              <Typography variant="h6">
                Short URL: <a href={`/${link.code}`}>http://localhost:3000/{link.code}</a>
              </Typography>
              <Typography variant="body1">Original URL: {link.url}</Typography>
              <Typography variant="body2">
                Created: {new Date(link.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Expires: {new Date(link.expiresAt).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Total Clicks: {link.clicks.length}
              </Typography>

              {link.clicks.length > 0 && (
                <>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1">Click Details:</Typography>
                  <ul>
                    {link.clicks.map((click, i) => (
                      <li key={i}>
                        {new Date(click.timestamp).toLocaleString()} — Referrer: {click.referrer}, Location: {click.location}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default StatsPage;
