import * as React from 'react';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { Route } from 'react-router-dom';
import { renderWithRouter } from 'common/test';
import { DashboardComponent } from './dashboard.component';
import { DashboardItemProps } from './dashboard.vm';

describe('common/DashboardComponent', () => {
  it('should be render as expected passing required properties', () => {
    // Arrange
    const props = {
      items: [
        {
          title: 'test name',
          icon: PeopleAltIcon,
          linkTo: 'linkTo',
        },
      ] as DashboardItemProps[],
    };

    // Act
    const { getByText } = renderWithRouter(
      <DashboardComponent {...props} />,
      <>
        <Route
          path={props.items[0].linkTo}
          component={() => <h1>Test route destination</h1>}
        />
      </>
    );

    // Assert
    expect(getByText(props.items[0].title)).toBeInTheDocument();
  });

  it('should be render as expected passing required and optional properties', () => {
    // Arrange
    const props = {
      items: [
        {
          title: 'test name',
          icon: PeopleAltIcon,
          linkTo: 'linkTo',
        },
      ] as DashboardItemProps[],
      classes: {
        root: 'test-root-class',
        items: 'test-items-class',
        item: 'test-item-class',
      },
      dataTestId: 'dashboard-id',
    };

    // Act
    const { getByTestId } = renderWithRouter(
      <DashboardComponent {...props} />,
      <>
        <Route
          path={props.items[0].linkTo}
          component={() => <h1>Test route destination</h1>}
        />
      </>
    );

    const element = getByTestId(props.dataTestId);

    // Assert
    expect(element).toHaveClass(props.classes.root);
    expect(element.firstChild).toHaveClass(props.classes.items);
  });

  it('should be render as expected passing three items', () => {
    // Arrange
    const props = {
      items: [
        {
          title: 'test name 1',
          icon: PeopleAltIcon,
          linkTo: 'linkTo 1',
        },
        {
          title: 'test name 2',
          icon: PeopleAltIcon,
          linkTo: 'linkTo 2',
        },
        {
          title: 'test name 3',
          icon: PeopleAltIcon,
          linkTo: 'linkTo 3',
        },
      ] as DashboardItemProps[],
      classes: {
        dashboard: 'test-dashboard-class',
        items: 'test-items-class',
        item: {
          item: 'test-item-class',
          icon: 'test-icon-class',
          name: 'test-name-class',
        },
      },
      dataTestId: 'dashboard-id',
    };

    // Act
    const { getByText } = renderWithRouter(
      <DashboardComponent {...props} />,
      <>
        <Route
          path={props.items[0].linkTo}
          component={() => <h1>Test route 1</h1>}
        />
        <Route
          path={props.items[1].linkTo}
          component={() => <h1>Test route 2</h1>}
        />
        <Route
          path={props.items[2].linkTo}
          component={() => <h1>Test route 3</h1>}
        />
      </>
    );

    // Assert
    expect(getByText(props.items[0].title)).toBeInTheDocument();
    expect(getByText(props.items[1].title)).toBeInTheDocument();
    expect(getByText(props.items[2].title)).toBeInTheDocument();
  });
});
