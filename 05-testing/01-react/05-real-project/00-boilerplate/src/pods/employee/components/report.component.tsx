import React from 'react';
import { Formik, Form } from 'formik';
import { SelectComponent } from 'common/components';
import { monthList } from 'common/constants';
import * as classes from './report.styles';
import { CommandFooterComponent } from 'common-app/command-footer';
import { cx } from 'emotion';
import { formValidation } from './report.validations';
import { Report } from '../employee.vm';

interface Props {
  report: Report;
  className?: string;
  onCancel: () => void;
  onGenerateExcel: (report: Report) => void;
}

export const ReportComponent: React.FunctionComponent<Props> = ({
  report,
  className,
  onCancel,
  onGenerateExcel,
}) => {
  return (
    <Formik
      initialValues={report}
      enableReinitialize={true}
      onSubmit={onGenerateExcel}
      validate={formValidation.validateForm}
    >
      {() => (
        <Form className={cx(classes.form, className)}>
          <SelectComponent
            name="month"
            label="Mes"
            items={monthList}
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
            className={classes.year}
          />
          <CommandFooterComponent
            onCancel={onCancel}
            className={classes.commands}
            labels={{ saveButton: 'Generar', cancelButton: 'Cancelar' }}
          />
        </Form>
      )}
    </Formik>
  );
};
