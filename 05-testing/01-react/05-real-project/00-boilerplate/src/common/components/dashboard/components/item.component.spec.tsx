import React from 'react';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { fireEvent } from '@testing-library/react';
import { renderWithRouter } from 'common/test';
import { Route } from 'react-router-dom';
import { ItemComponent, ClassesProps } from './item.component';
import { DashboardItemProps } from '../dashboard.vm';

describe('common/dashboard/ItemComponent', () => {
  it('should be render as expected passing required properties', () => {
    // Arrange
    const props = {
      item: {
        icon: PeopleAltIcon,
        title: 'test name',
        linkTo: '/test-link',
      } as DashboardItemProps,
      dataTestId: 'test-item',
    };

    // Act
    const { getByText } = renderWithRouter(
      <ItemComponent {...props} />,
      <>
        <Route
          path={props.item.linkTo}
          component={() => <h1>Test route destination</h1>}
        />
      </>
    );

    // Assert
    expect(getByText(props.item.title)).toBeInTheDocument();
  });

  it('should be render as expected passing required and optional properties', () => {
    // Arrange
    const props = {
      item: {
        icon: PeopleAltIcon,
        title: 'test name',
        linkTo: '/test-link',
        subtitle: 'test subtitle',
      } as DashboardItemProps,
      classes: {
        root: 'test-root-class',
        icon: 'test-icon-class',
        title: 'test-name-class',
        subtitle: 'test-subtitle-class',
      } as ClassesProps,
      dataTestId: 'test-item',
    };

    // Act
    const { getByTestId, getByText } = renderWithRouter(
      <ItemComponent {...props} />,
      <>
        <Route
          path={props.item.linkTo}
          component={() => <h1>Test route destination</h1>}
        />
      </>
    );

    const element = getByTestId(props.dataTestId);

    // Assert
    expect(element).toHaveClass(props.classes.root);
    expect(getByText(props.item.title)).toHaveClass(props.classes.title);
    expect(getByText(props.item.subtitle)).toHaveClass(props.classes.subtitle);
  });

  it('should navigate to route when click on item component', () => {
    // Arrange
    const props = {
      item: {
        icon: PeopleAltIcon,
        title: 'test name',
        linkTo: '/test-link',
        subtitle: 'test subtitle',
      } as DashboardItemProps,
      classes: {
        root: 'test-root-class',
        icon: 'test-icon-class',
        title: 'test-name-class',
        subtitle: 'test-subtitle-class',
      } as ClassesProps,
      dataTestId: 'test-item',
    };

    // Act
    const { getByTestId, getByText } = renderWithRouter(
      <ItemComponent {...props} />,
      <>
        <Route
          path={props.item.linkTo}
          component={() => <h1>Test route destination</h1>}
        />
      </>
    );

    const element = getByTestId(props.dataTestId);
    fireEvent.click(element);

    // Assert

    expect(getByText('Test route destination')).toBeInTheDocument();
  });
});
