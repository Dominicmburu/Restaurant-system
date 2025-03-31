// src/components/common/Card.jsx
import React from 'react';
import { Card as MuiCard, CardContent, Typography } from '@mui/material';

const Card = ({ title, children }) => {
  return (
    <MuiCard sx={{ mb: 2, p: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </MuiCard>
  );
};

export default Card;
