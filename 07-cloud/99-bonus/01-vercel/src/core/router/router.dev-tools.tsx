import React from 'react';
import { ENV } from '#core/constants';

export const TanStackRouterDevtools = ENV.IS_PRODUCTION
  ? () => null // Render nothing in production
  : React.lazy(() =>
      import('@tanstack/router-devtools').then(res => ({
        default: res.TanStackRouterDevtools,
      }))
    );
