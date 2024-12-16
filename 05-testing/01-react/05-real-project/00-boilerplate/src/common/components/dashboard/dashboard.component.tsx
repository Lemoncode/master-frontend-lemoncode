import React from 'react';
import { cx } from '@emotion/css';
import { ItemComponent, ClassesProps } from './components';
import { DashboardItemProps } from './dashboard.vm';
import * as innerClasses from './dashboard.styles';

interface ClassNameProps {
  root?: string;
  items?: string;
  item?: ClassesProps;
}

interface Props {
  items: DashboardItemProps[];
  classes?: ClassNameProps;
  dataTestId?: string;
}

export const DashboardComponent: React.FC<Props> = (props) => {
  const {
    items,
    classes = {
      root: '',
      items: '',
      item: {
        root: '',
        icon: '',
        title: '',
      },
    },
    dataTestId,
  } = props;
  return (
    <div
      data-testid={dataTestId}
      className={cx(innerClasses.root, classes.root)}
    >
      <div className={cx(innerClasses.items, classes.items)}>
        {items.map(
          (item) =>
            Boolean(item) && (
              <ItemComponent
                key={item.title}
                classes={{
                  ...classes.item,
                  root: cx(innerClasses.item, classes.item.root),
                }}
                item={item}
              />
            )
        )}
      </div>
    </div>
  );
};
