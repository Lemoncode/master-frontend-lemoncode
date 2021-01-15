import React from 'react';
import { Formik, Form } from 'formik';
import { SelectComponent } from 'common/components';
import { monthList } from 'common/constants';
import { CommandFooterComponent } from 'common-app/command-footer';
import { cx } from 'emotion';
import * as classes from './report.styles';

interface Props {
  onCancel: () => void;
  className: string;
}

export const ReportComponent: React.FunctionComponent<Props> = ({
  onCancel,
  className,
}) => {
  return (
    <Formik initialValues={{}} enableReinitialize={true} onSubmit={console.log}>
      {() => (
        <Form className={cx(classes.form, className)}>
          <SelectComponent
            name="month"
            label="Mes"
            items={monthList}
            disabled
            className={classes.month}
          />
          <SelectComponent
            name="year"
            label="Año"
            items={[
              {
                id: '2020',
                name: '2020',
              },
            ]}
            disabled
            className={classes.year}
          />
          <CommandFooterComponent
            onCancel={onCancel}
            labels={{ saveButton: 'Generar', cancelButton: 'Cancelar' }}
            className={classes.commands}
          />
        </Form>
      )}
    </Formik>
  );
};
