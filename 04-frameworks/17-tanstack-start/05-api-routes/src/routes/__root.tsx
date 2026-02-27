import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import normalizeCss from 'normalize.css?url';
import * as React from 'react';
import materialIcons from './material-icons.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Rent a car' },
    ],
    links: [
      { rel: 'icon', type: 'image/png', href: '/home-logo.png' },
      { rel: 'stylesheet', href: normalizeCss },
      { rel: 'stylesheet', href: materialIcons },
    ],
  }),
  shellComponent: RootComponent,
});

function RootComponent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <main>{children}</main>
        <TanStackRouterDevtools />
        <Scripts />
      </body>
    </html>
  );
}
