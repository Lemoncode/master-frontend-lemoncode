import * as React from 'react';
import { cx } from 'emotion';
import Button from '@material-ui/core/Button';
import * as classes from './command-footer.style';

interface LabelProps {
  cancelButton?: string;
  saveButton?: string;
}

interface Props {
  onCancel: () => void;
  onSave?: () => void;
  labels?: LabelProps;
  className?: string;
}

export const CommandFooterComponent: React.FunctionComponent<Props> = props => {
  const { onCancel, onSave, className } = props;
  const labels: LabelProps = {
    cancelButton: 'Cancelar',
    saveButton: 'Guardar',
    ...props.labels,
  };

  return (
    <div className={cx(classes.footerButtonsContainer, className)}>
      <Button variant="contained" color="primary" onClick={onCancel}>
        {labels.cancelButton}
      </Button>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={() => {
          if (onSave) onSave();
        }}
      >
        {labels.saveButton}
      </Button>
    </div>
  );
};
