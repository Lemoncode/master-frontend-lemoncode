# CSRF (Cross-Site Request Forgery)

Se trata de un tipo de ataque que engaña al usuario para que ejecute acciones no deseadas en una aplicación web en la que está auntenticado. El atacante se aprovecha de la confianza que el usuario tiene en la aplicación y la utiliza para realizar acciones en su nombre. CSRF utiliza esta confianza para enviar una petición a la aplicación con la cookie de sesión. La aplicación web no tiene forma de distinguir entre una solicitud legítima y una solicitud CSRF, por lo que procesa la solicitud como si viniera del usuario.

En este ejemplo vamos a ver como se puede realizar un ataque CSRF, los errores que se pueden cometer al crear una aplicación web y como se puede evitar este tipo de ataques.

Vamos a tener tres partes funcionando:

- El frontend de un banco.
- El backend de un banco.
- El frontend de un sitio malicioso que recopila información.

## Instalación

Hacemos un `npm install` en este mismo directorio, para así instalar las dependencias de las 3 apps.

```bash
npm install
```

Podemos arrancar las apps con `npm start`, o arrancarlas mejor individualmente para ver el mensaje por la consola de la app de backend cuando se produzca el ataque.

```bash
npm start

```

Abrimos el navegador y accedemos a la app de frontend con la URL [http://localhost:1234](http://localhost:1234)

![01](assets/01.png)

> ## Pasos

Una vez que arrancamos el frontend y el backend de mybank, podemos logearnos usando:

```text
email: user@email.com
password: test
```

Ya logeado podemos abrir las _dev tools_ del navegador para ver que dentro de _Application_ tenemos almecenada nuestra cookie.

![02](assets/02.png)

Ahora abrimos en nuestro navegador la URL [http://localhost:1235](http://localhost:1235), donde vamos a simular que nos han enviado un correo con un enlace malicioso. Hemos creado un enlace que nos redirige a una web false de noticias, la cual lleva a cabo el ataque CSRF.

En este caso vamos a intentar hacer un cross posting al dominio del banco desde nuestra aplicación maliciosa arrastrando las cookies del banco.

Dentro de la la ruta _frontend-chupichuli/src/index.html_, tenemos un fetch comentado. Como está ahora mismo sería seguro y no se realizaría el CSRF.

```javascript
 <script>
    // Esto es CSRF mediante una petición POST
    fetch("/api/security/edit", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "hack@hacker.com",
      }),
  </script>
```

Si entramos en las _dev tools_ en la consola nos dice que el servidor ha respondido con un 405, método no permitido y no se ha podido realizar la petición. Es decir, estamos seguros que no se ha realizado el ataque.

Esto pasa porque hacemos una petición POST.

![03](assets/03.png)

¿Y si cambiamos por un GET? Esto se consideraría una mala práctica a la horade implementar tu API REST, pero es muy común encontrarlo en API's que no
están bien implementadas.

Este cambio es un error, ya que el método GET no debería modificar datos en el servidor. Si utilizamos el método GET para realizar una petición que modifica datos en el servidor, estamos abriendo la puerta a un ataque CSRF.

Vamos a refactorizar nuestro código:

_frontend-chupichuli/src/index.html_:

```diff
<script>
-       // Esto es CSRF mediante una petición POST
-       fetch("/api/security/edit", {
-         method: "POST",
-         credentials: "include",
-         headers: {
-           "Content-Type": "application/json",
-         },
-         body: JSON.stringify({
-           email: "hack@hacker.com",
-         }),
-       });
+      // Esto es CSRF mediante una petición GET
+      fetch("http://localhost:3000/api/security/edit?" +
+        new URLSearchParams({
+          email: "hack@hacker.com",
+        }), {
+        method: "GET",
+        credentials: "include",
+      })
+        .then((response) => response.json())
+        .then((text) => console.log(text))
+        .catch((error) => console.log(error));
</script>
```

Y vamos a nuestro backend a _backend-mybank/src/pods/security/security.rest-api.js_ al _endpoint_ de _edit_, y cambiamos el método _post_ por _get_.

_backend-mybank/src/pods/security/security.rest-api.js_:

```diff
- .post("/edit", authenticationMiddleware, async (req, res, next) =>
+ .get("/edit", authenticationMiddleware, async (req, res, next) => {
    try {
      const newUserEmail = await userRepository.updateEmail(
        req.userSession?.id,
-       req.body.email,
+       req.query.email.toString(),
      );
      console.log(
        `User ${req.userSession?.id} email changed to ${newUserEmail}`
      );
      res.status(200).json({
        message: "Email changed",
        newEmail: newUserEmail,
      });
    } catch (error) {
      next(error);
    }
  });

```

Volvemos a repetir la simulación de la apertura de nuestra aplicación maliciosa, y vemos que en la consola del _backend_ de _mybank_ nos aparece el mensaje de que el email ha sido cambiado.

![04](assets/04.png)

Ahora podríamos entrar en he perdido mi contraseña y cambiarla sin ningún problema y hacer en la aplicación de _mibank_ lo que quisiéramos.
