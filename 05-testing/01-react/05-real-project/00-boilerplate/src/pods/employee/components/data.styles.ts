import { css } from 'emotion';
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
  grid-row-gap: ${theme.spacing(2)}px;
  grid-column-gap: ${theme.spacing(3)}px;

  @media (min-width: ${theme.breakpoints.values.md}px) {
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
