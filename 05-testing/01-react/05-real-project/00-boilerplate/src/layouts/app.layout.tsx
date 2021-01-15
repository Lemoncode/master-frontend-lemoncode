import React from 'react';
import { AppBarComponent } from 'common-app/app-bar';
import { FooterComponent } from 'common/components';
import * as classes from './app.layout.styles';

export const AppLayout: React.FC = ({ children }) => (
  <div className={classes.container}>
    <AppBarComponent />
    <main className={classes.main}>{children}</main>
    <FooterComponent />
  </div>
);
