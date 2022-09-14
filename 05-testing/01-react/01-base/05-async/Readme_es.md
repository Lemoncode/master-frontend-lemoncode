# 05 Async

Hasta ahora todo ha ido muy bien, tenemos una función, esperamos un resultado y probamos que va todo bien, ¡Genial!, pero ç
en la vida real, nos encontraremos con un escenario que nos puede complicar la implementación de pruebas unitarias: la
asincronía, es decir código que no nos tiene porque dar una respuesta inmediata y toca esperar a que se resuelva una acción
(por ejemplo una llamada a un servicio externo).

En este ejemplo vamos a aprender a manejarnos con código asíncrono.

Tomamos como punta de partida `04-tdd`.

Resumen de pasos que vamos a realizar:

- Tenemos un método `getMembers` que realiza una llamada a una API Rest de Github.
- Esta llamada puede fallar y tendríamos que manejar una serie de errores.
- Vamos a implementar el manejo de errores en esta función.
- Vamos a implementar los tests que comprueben que esto está funcionando como esperábamos (este ejemplo es el típico en el que las pruebas unitarias nos pueden venir muy bien, ya que no tenemos control sobre la API para forzar un 500 o otros mensajes de error y es bueno probar por nosotros mismos
  que este control está bien implementado mediante pruebas unitarias).

# Manos a la obra

- Ya hemos copiado el ejemplo anterior, vamos a ejecutar desde la línea de
  comandos `npm install` para instalar los paquetes de npm que ya teníamos
  en nuestro _package.json_ en el proyecto anterior:

```bash
npm install
```

- Esta vez queremos implementar el manejo de erorres en `getMembers`, en concreto los códigos de error:

> 403: API rate limit exceeded
> 503: Service unavailable

### ./src/api.ts

```diff
- import Axios from 'axios';
+ import Axios, { AxiosError } from 'axios';
import { Member } from './api-model';

const url = 'https://api.github.com/orgs/lemoncode/members';

export const getMembers = (): Promise<Member[]> =>
- Axios.get(url).then(({ data }) => data);
+ Axios.get(url)
+   .then((response) => response.data)
+   .catch((error: AxiosError) => {
+     switch (error.response.status) {
+       case 403:
+         throw 'Too much Github API calls!';
+       case 503:
+         throw 'Unavailable service';
+     }
+   });

```

- Ahora que tenemos este implementado, vamos a actualizar el código de aplicación que consume esto para muestre el mensaje de error por consola:

### ./src/app.tsx

```diff
import * as React from 'react';
import { getMembers } from './api';
import { mapToMemberVMList } from './mapper';

export const App: React.FunctionComponent = () => {
  React.useEffect(() => {
    getMembers()
      .then(members => {
        console.log(mapToMemberVMList(members));
-     });
+     })
+     .catch(error => console.log(error));
  }, []);

  return <h1>React testing by sample</h1>;
};

```

- Hasta aquí muy bien, pero si, por ejemplo quisiéramos probar esto de manera manual nos sería complicado, vamos a comprobar que
  todo funciona implementando pruebas unitarias, arrancamos con un esqueleto.

### ./src/api.spec.ts

```javascript
import { getMembers } from './api';

describe('api specs', () => {
  it('', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

- Vamos a intentar implementar esto como siempre, realizamos una petición, sobrescribimos la implementación de _Axios.get_
  para devolver unos datos y comprobamos que en efecto nos devuelve esa información:

### ./src/api.spec.ts

```diff
+ import Axios from 'axios';
+ import { Member } from './api-model';
import { getMembers } from './api';

describe('api specs', () => {
- it('', () => {
+ it('should return members when it resolves the request successfully', () => {
    // Arrange
+   const members: Member[] = [
+     {
+       id: 1,
+       login: 'test login',
+       avatar_url: 'test avatar_url',
+     },
+   ];

+   const getStub = jest.spyOn(Axios, 'get').mockResolvedValue({
+     data: members,
+   });

    // Act
+   const result = getMembers();

    // Assert
+   expect(getStub).toHaveBeenCalledWith(
+     'https://api.github.com/orgs/lemoncode/members'
+   );
+   expect(result).toEqual(members);
  });
});

```

- Si ejecutamos los test, nos damos cuenta de que esto falla,¿Comooor? Porque es código asíncrono y tenemos
  que decirle a `jest` que tiene que esperar a que se resuelva la promesa (es decir que obtengamos el
  resultado de la llamada asíncrona, que no es algo directo).

¿Cómo podemos arreglar esto? Tenemos dos aproximaciónes, la primera es utilizar el parámetro de tipo función `done` en jest,
¿Cómo funciona esto? Nosotros lanzamos nuestro código asíncrono, y metemos un _then_ para esperar a que la llamada
asíncrona se resuelva, ahí comprobamos que el resultado es el esperado e invocamos a la función `done` para indicarle
que la ejecución del test ha terminado (si se nos olvida poner el `done` el test dará un timeout y fallará)

### ./src/api.spec.ts

```diff
import Axios from 'axios';
import { Member } from './api-model';
import { getMembers } from './api';

describe('api specs', () => {
- it('should return members when it resolves the request successfully', () => {
+ it('should return members when it resolves the request successfully', done => {
    // Arrange
    const members: Member[] = [
      {
        id: 1,
        login: 'test login',
        avatar_url: 'test avatar_url',
      },
    ];

    const getStub = jest.spyOn(Axios, 'get').mockResolvedValue({
      data: members,
    });

    // Act
-   const result = getMembers();
+   getMembers().then(result => {
      // Assert
      expect(getStub).toHaveBeenCalledWith(
        'https://api.github.com/orgs/lemoncode/members'
      );
      expect(result).toEqual(members);
+     done();
+   });
  });
});

```

- Esto está muy bien, pero el código se queda un poco complicado de leer, también podemos hacer uso de
  `async/await` de esta manera el código se queda más lineal y podemos eliminar el done (eso sí, tenemos
  que marcar la función del test como `async`), veamos como sería:

> Más info sobre como funciona esto: [Jest testing async code](https://jestjs.io/docs/en/asynchronous.html)

### ./src/api.spec.ts

```diff
import Axios from 'axios';
import { Member } from './api-model';
import { getMembers } from './api';

describe('api specs', () => {
- it('should return members when it resolves the request successfully', done => {
+ it('should return members when it resolves the request successfully', async () => {
    // Arrange
    const members: Member[] = [
      {
        id: 1,
        login: 'test login',
        avatar_url: 'test avatar_url',
      },
    ];

    const getStub = jest.spyOn(Axios, 'get').mockResolvedValue({
      data: members,
    });

    // Act
-   getMembers().then(result => {
+   const result = await getMembers();

      // Assert
      expect(getStub).toHaveBeenCalledWith(
        'https://api.github.com/orgs/lemoncode/members'
      );
      expect(result).toEqual(members);
-     done();
-   });
  });
});

```

- Sabiendo como va esto podemos implementar el resto de casos, para los errores además Jest nos provee
  de azúcar para resolver promesas con errores, en este caso vamos a probar el error "Too much Github API calls!"
  cuando se rechaza la petición con un código de error 403:

### ./src/api.spec.ts

```diff
- import Axios from 'axios';
+ import Axios, { AxiosError } from 'axios';
import { Member } from './api-model';
import { getMembers } from './api';
...

+ it('should throw an error with "Too much Github API calls!" when it rejects the request with 403 status code', async () => {
+   // Arrange
+   const getStub = jest.spyOn(Axios, 'get').mockRejectedValue({
+     response: {
+       status: 403,
+     },
+   } as AxiosError);

+   // Act
+   try {
+     const result = await getMembers();
+   } catch (error) {
+     // Assert
+     expect(getStub).toHaveBeenCalledWith(
+       'https://api.github.com/orgs/lemoncode/members'
+     );
+     expect(error).toEqual('Too much Github API calls!');
+   }
+ });
...

```

- Vamos a probar ahora con el error "Unavailable service", ¿Te animas a implementarlo tú?

### ./src/api.spec.ts

```diff
...

+ it('should throw an error with "Unavailable service" when it rejects the request with 503 status code', async () => {
+   // Arrange
+   const getStub = jest.spyOn(Axios, 'get').mockRejectedValue({
+     response: {
+       status: 503,
+     },
+   } as AxiosError);

+   // Act
+   try {
+     const result = await getMembers();
+   } catch (error) {
+     // Assert
+     expect(getStub).toHaveBeenCalledWith(
+       'https://api.github.com/orgs/lemoncode/members'
+     );
+     expect(error).toEqual('Unavailable service');
+   }
+ });
...

```

- Para finalizar veamos que obtenemos _undefined_ si el código de error es otro:

### ./src/api.spec.ts

```diff
...
+ it('should return undefined when it rejects the request with different status code', async () => {
+   // Arrange
+   const getStub = jest.spyOn(Axios, 'get').mockRejectedValue({
+     response: {
+       status: 404,
+     },
+   } as AxiosError);

+   // Act
+   const result = await getMembers();
+   // Assert
+   expect(getStub).toHaveBeenCalledWith(
+     'https://api.github.com/orgs/lemoncode/members'
+   );
+   expect(result).toBeUndefined();
+ });
...

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
