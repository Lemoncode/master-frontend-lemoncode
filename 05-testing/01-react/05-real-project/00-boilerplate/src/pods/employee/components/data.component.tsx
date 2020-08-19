import React from 'react';
import { Formik, Form } from 'formik';
import { TextFieldComponent, CheckboxComponent } from 'common/components';
import produce from 'immer';
import { CommandFooterComponent } from '../../../common-app/command-footer';
import * as classes from './data.styles';
import { cx } from 'emotion';
import { Employee } from '../employee.vm';
import { formValidation, validationSchema } from './data.validations';
import { Validators } from '@lemoncode/fonk';

interface Props {
  employee: Employee;
  className?: string;
  isEditMode: boolean;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export const DataComponent: React.FunctionComponent<Props> = ({
  employee,
  className,
  onSave,
  isEditMode,
  onCancel,
}) => {
  React.useEffect(() => {
    const newValidationSchema = produce(validationSchema, darft => {
      darft.field.temporalPassword = isEditMode ? [] : [Validators.required];
    });
    formValidation.updateValidationSchema(newValidationSchema);
  }, [isEditMode]);

  return (
    <Formik
      initialValues={employee}
      enableReinitialize={true}
      onSubmit={onSave}
      validate={formValidation.validateForm}
    >
      {() => (
        <Form className={cx(classes.form({ isEditMode }), className)}>
          <TextFieldComponent
            label="Id"
            name="id"
            className={classes.id}
            InputProps={{
              readOnly: true,
            }}
          />
          {!isEditMode && (
            <TextFieldComponent
              label="Clave Temporal"
              name="temporalPassword"
              className={classes.temporalPassword}
            />
          )}
          <TextFieldComponent
            label="Nombre"
            name="name"
            className={classes.name}
          />
          <TextFieldComponent
            label="Email"
            name="email"
            className={classes.email}
          />
          <CheckboxComponent
            name="isActive"
            label="Activo"
            color="primary"
            className={classes.isActive}
          />
          <CommandFooterComponent
            onCancel={onCancel}
            className={classes.commands}
          />
        </Form>
      )}
    </Formik>
  );
};
