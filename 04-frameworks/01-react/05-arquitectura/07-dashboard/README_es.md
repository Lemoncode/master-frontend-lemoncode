# 06 Lista de módulos

Vamos a crear una página con una lista de módulos de la aplicación,
clicando en una de ellas podremos navegar a la opción deseada.

# Pasos

- Copiate el ejemplo anterior _06-app-layout_ y haz un _npm install_

```bash
npm install
```

- Esta lista de módulos se puede implementar directamente en su
  pod, al ser algo reaprovechable en muchos proyectos, hemos creado
  un componente reusable:

Lo primero que le va a hacer falta un elemento el dashboard, en este
caso el titulo, el enlace a donde tiene que navegar, y elegimos
entre un icono y una imagen (si os fijáis este componente se usa
también en la selección de curso del campus).

_./src/common/components/dashboard/dashboard.vm.ts_

```ts
export interface DashboardItemProps {
  title: string;
  linkTo: string;
  icon?: React.ComponentType<{ className: string }>;
  image?: string;
  subtitle?: string;
}
```

- Vamos a definir primero como sería una sóla opción:

_./src/common/components/dashboard/components/item.styles.ts_

```ts
import { css } from 'emotion';

export const root = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  border: none;
  text-decoration: none;
  color: #333;

  &:hover {
    background-color: #e6e6e6;
  }
`;

export const icon = css`
  font-size: 5rem;
`;

export const title = css`
  margin-top: 20px;
`;

export const subtitle = css`
  margin-top: 20px;
`;
```

_./src/common/components/dashboard/components/item.component.tsx_

```tsx
import React from 'react';
import { cx } from 'emotion';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { DashboardItemProps } from '../dashboard.vm';
import * as innerClasses from './item.styles';

export interface ClassesProps {
  root?: string;
  icon?: string;
  title?: string;
  subtitle?: string;
}

interface Props {
  item: DashboardItemProps;
  classes?: ClassesProps;
  dataTestId?: string;
}

export const ItemComponent: React.StatelessComponent<Props> = props => {
  const {
    item: { icon: Icon, title, linkTo, subtitle },
    classes,
    dataTestId,
  } = props;
  return (
    <Link
      className={cx(innerClasses.root, classes.root)}
      to={linkTo}
      data-testid={dataTestId}
    >
      <Icon className={cx(innerClasses.icon, classes.icon)} />
      <Typography
        variant="h5"
        className={cx(innerClasses.title, classes.title)}
      >
        {title}
      </Typography>
      <Typography
        variant="h6"
        className={cx(innerClasses.subtitle, classes.subtitle)}
      >
        {subtitle}
      </Typography>
    </Link>
  );
};

ItemComponent.defaultProps = {
  classes: {
    root: '',
    icon: '',
    title: '',
    subtitle: '',
  },
};
```

- Vamos a crear un barrel para exponer el componente:

_./src/common/components/dashboard/components/index.ts_

```ts
export * from './item.component';
```

- Vamos ahora a por el componente que mostrará la lista de submodulos:

_./src/common/components/dashboard/dashboard.styles.ts_

```ts
import { css } from 'emotion';
import { theme } from 'core/theme';

export const root = css`
  display: flex;
  flex-direction: column;
`;

export const items = css`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 4rem;

  @media (min-width: ${theme.breakpoints.values.sm}px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const item = css`
  padding: 2rem 0rem;
`;
```

_./src/common/components/dashboard/dashboard.component.tsx_

```tsx
import React from 'react';
import { cx } from 'emotion';
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

export const DashboardComponent: React.StatelessComponent<Props> = props => {
  const { items, classes, dataTestId } = props;
  return (
    <div
      data-testid={dataTestId}
      className={cx(innerClasses.root, classes.root)}
    >
      <div className={cx(innerClasses.items, classes.items)}>
        {items.map(
          item =>
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

DashboardComponent.defaultProps = {
  classes: {
    root: '',
    items: '',
    item: {
      root: '',
      icon: '',
      title: '',
    },
  },
};
```

- Vamos a crear un barrel para crear exponer el componente de
  dashboard y su viewmodel.

_./src/common/components/dashboard/index.ts_

```ts
export * from './dashboard.component';
export { DashboardItemProps } from './dashboard.vm';
```

Y vamos a incluirlo en el index de _common/components_

_./src/common/components/index.ts_

```diff
export * from './form';
+ export * from './dashboard';
```

- Veamos como de simple queda nuestro pod de submodulo
  utilizando este asset reusable:

_./src/pods/submodulelist/submodule-list.component.tsx_

```tsx
import React from 'react';
import { DashboardComponent, DashboardItemProps } from 'common/components';

interface Props {
  items: DashboardItemProps[];
}

export const SumoduleListComponent: React.FunctionComponent<Props> = props => {
  const { items } = props;
  return <DashboardComponent items={items} />;
};
```

_./src/pods/submodulelist/submodule-list.container.tsx_

```tsx
import React from 'react';
import { SumoduleListComponent } from './submodule-list.component';
import { DashboardItemProps } from 'common/components';
import { routes } from 'core/router';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GroupIcon from '@material-ui/icons/Group';

export const SubmoduleListContainer: React.FunctionComponent = () => {
  const items: DashboardItemProps[] = React.useMemo(
    (): DashboardItemProps[] => [
      {
        title: 'Proyectos',
        linkTo: '#', // No link defined
        icon: AccountBalanceIcon,
      },
      {
        title: 'Empleados',
        linkTo: routes.employees,
        icon: GroupIcon,
      },
    ],
    []
  );

  return <SumoduleListComponent items={items} />;
};
```

_./src/pods/submodulelist/index.ts_

```ts
export * from './submodule-list.container';
```

- Y vamos a usarlo en la escena:

_./src/scenes/submodule-list.scene.tsx_

```diff
import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'core/router';
import { AppLayout } from 'layouts';
+ import {SubmoduleListContainer} from 'pods/submoduleList';

export const SubmoduleListScene: React.FC = () => {
  return (
    <AppLayout>
-      <h1>Submodule list Scene!</h1>
-      <Link to={routes.employees}>Navigate employee list</Link>
+      <SubmoduleListContainer/>
    </AppLayout>
  );
};
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
