import React from 'react';
import { Formik, Form } from 'formik';
import { TextFieldComponent, CheckboxComponent } from 'common/components';
import { cx } from 'emotion';
import { Employee } from '../employee.vm';

interface Props {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onCancel: () => void;
}

export const DataComponent: React.FunctionComponent<Props> = ({
  employee,
  onSave,
  onCancel,
}) => {
  return (
    <Formik
      initialValues={employee}
      enableReinitialize={true}
      onSubmit={onSave}
    >
      {() => (
        <Form>
          <TextFieldComponent
            label="Id"
            name="id"
            InputProps={{
              readOnly: true,
            }}
          />
          <TextFieldComponent label="Nombre" name="name" />
          <TextFieldComponent label="Email" name="email" />
          <CheckboxComponent name="isActive" label="Activo" color="primary" />
        </Form>
      )}
    </Formik>
  );
};
