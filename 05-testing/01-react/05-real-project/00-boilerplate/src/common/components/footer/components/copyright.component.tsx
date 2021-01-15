import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { literals } from 'core/i18n';

export const CopyrightComponent: React.FC = () => (
  <Typography variant="body2" align="center">
    {' © '}
    <Link
      color="inherit"
      target="_blank"
      rel="noopener"
      href="https://lemoncode.net/"
    >
      {literals.global.lemoncode}
    </Link>{' '}
    {new Date().getFullYear()}
    {` - ${literals.global.copyrightFooter}`}
  </Typography>
);
