import React from "react";
import { css } from "@emotion/react";

enum bp {
  xs,
  sm,
  md,
  lg,
}

const bpValues: number[] = [];

bpValues[bp.xs] = 767;
bpValues[bp.sm] = 991;
bpValues[bp.md] = 1100;
bpValues[bp.lg] = 1200;

const mq: string[] = bpValues.map((bp) => `@media(max-width: ${bp}px)`);

const breakpointSm = 420;

const h1Class = css`
  font-size: 180%;
  ${mq[bp.lg]} {
    font-size: 100%;
  }
  ${mq[bp.md]} {
    font-size: 100%;
  }
  ${mq[bp.sm]} {
    font-size: 80%;
  }
  ${mq[bp.xs]} {
    font-size: 60%;
  }
`;

export const App = () => {
  return <h1 css={h1Class}>Hello React !!</h1>;
};
