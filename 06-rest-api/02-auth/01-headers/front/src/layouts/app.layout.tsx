import React from 'react';
import { AppBarComponent } from '#core/app-bar';
import * as classes from './app.layout.styles';

interface ChildrenProps {
  className: string;
}

interface Props {
  children: (props: ChildrenProps) => React.ReactNode;
}

export const AppLayout: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <>
      <AppBarComponent />
      <main>{children({ className: classes.content })}</main>
    </>
  );
};
