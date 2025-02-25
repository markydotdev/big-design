import { Breakpoints, breakpointsOrder, ThemeInterface } from '@bigcommerce/big-design-theme';
import { css, FlattenSimpleInterpolation } from 'styled-components';

import { DisplayOverload, DisplayProps } from './types';

export const withDisplay = () => css<DisplayProps>`
  ${({ display, theme }) => display && getDisplayStyles(display, theme, 'display')};
`;

const getDisplayStyles: DisplayOverload = (
  displayProp: any,
  theme: ThemeInterface,
  cssKey: any,
): FlattenSimpleInterpolation => {
  if (typeof displayProp === 'object') {
    return getResponsiveDisplay(displayProp, theme, cssKey);
  }

  if (typeof displayProp === 'string' || typeof displayProp === 'number') {
    return getSimpleDisplay(displayProp, cssKey);
  }

  return [];
};

const getSimpleDisplay = (
  displayProp: string | number,
  cssKey: string,
): FlattenSimpleInterpolation => css`
  ${cssKey}: ${displayProp}
`;

const getResponsiveDisplay: DisplayOverload = (
  displayProp: any,
  theme: ThemeInterface,
  cssKey: string,
): FlattenSimpleInterpolation[] => {
  const breakpointKeys = Object.keys(displayProp).sort(
    (firstBreakpoint, secondBreakpoint) =>
      breakpointsOrder.indexOf(firstBreakpoint as keyof Breakpoints) -
      breakpointsOrder.indexOf(secondBreakpoint as keyof Breakpoints),
  );

  return (breakpointKeys as Array<keyof Breakpoints>).map(
    (breakpointKey) =>
      css`
        ${theme.breakpoints[breakpointKey]} {
          ${getSimpleDisplay(displayProp[breakpointKey], cssKey)}
        }
      `,
  );
};
