# 03 Integration testing

So far we have just unit tested components, what about making an integration test?
We can mount a bunch of components and test them all together!

We will start from `02-name-edit`.

# Steps

`npm install` to install previous sample packages:

```bash
npm install
```

Now we will split our _name-edit_ component and we create the _display_ and _edit_ components.

### ./src/display.tsx

```javascript
import React from 'react';

interface Props {
  userName: string;
}

export const Display: React.FC<Props> = (props) => {
  const { userName } = props;

  return <h3>{userName}</h3>;
};
```

### ./src/edit.tsx

```javascript
import React from 'react';

interface Props {
  userName: string;
  onSetUserName: (userName: string) => void;
}

export const Edit: React.FC<Props> = (props) => {
  const { userName, onSetUserName } = props;

  return (
    <input value={userName} onChange={(e) => onSetUserName(e.target.value)} />
  );
};
```

Update `name-edit` component:

### ./src/name-edit.tsx

```diff
import React from 'react';
+ import { Display } from './display';
+ import { Edit } from './edit';

export const NameEdit: React.FunctionComponent = () => {
  const [userName, setUserName] = React.useState('');

  return (
    <>
-     <h3>{userName}</h3>
+     <Display userName={userName} />
-     <input value={userName} onChange={(e) => setUserName(e.target.value)} />
+     <Edit userName={userName} onSetUserName={setUserName} />
    </>
  );
};

```

Now, do we need to make any change on the _name-edit_ test? Let's see...

```bash
npm run test:watch
```

Nope ! Wow ! how does this work? React Testing library just mounts the whole component and since we are keeping the same elements, the test is still valid as is.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
