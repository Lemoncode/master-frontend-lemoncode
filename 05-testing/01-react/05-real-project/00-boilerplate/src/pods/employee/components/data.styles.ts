import { css } from '@emotion/css';
import { theme } from 'core/theme';

interface Props {
  isEditMode: boolean;
}

const getDynamicAreaNames = (props: Props) => {
  return props.isEditMode
    ? `'id employeeName'`
    : `'id temporalPassword' 'employeeName .'`;
};

export const form = (props: Props) => css`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'id'
    ${props.isEditMode ? '' : `'temporalPassword'`}
    'employeeName'
    'email'
    'isActive'
    'commands'
    'commands';
  grid-row-gap: ${theme.spacing(2)};
  grid-column-gap: ${theme.spacing(3)};

  ${theme.breakpoints.up('md')} {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      ${getDynamicAreaNames(props)}
      'email .'
      'isActive .'
      'commands commands';
  }
`;

export const id = css`
  grid-area: id;
`;

export const temporalPassword = css`
  grid-area: temporalPassword;
`;

export const name = css`
  grid-area: employeeName;
`;

export const email = css`
  grid-area: email;
`;

export const isActive = css`
  grid-area: isActive;
`;

export const commands = css`
  grid-area: commands;
`;
