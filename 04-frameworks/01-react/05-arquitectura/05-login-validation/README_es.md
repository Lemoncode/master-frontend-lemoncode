# 05 Login Validation

Vamos a añadir validación en linea al formulario.

# Pasos

- Copiate el ejemplo anterior _04-theming_ y haz un \_npm install\_

```bash
npm install
```

- Vamos a tirar de una librería de gestión de estado de formularios en este
  caso elegiremos **Formik**.

```bash

```

- Vamos a instalarnos **Fonk** una librería de validación de formularios
  y su binding para **Formik**

```bash

```

- Vamos a montar el armazon de formik en el formulario de login:

- Para ir actualizando campo por campo tendríamos que hacer algo así como...

- Pero ¿ Y si hacemos un wrapper y nos ahorramos trabajo?

- Ahora si, mira como queda el formulario:

- Vamos ahora a por la validacion: definimos el esquema de validación
  del formulario:

- Y vamos a aplicarlo en nuestro formulario de login:

- Si ejecutamos podemos ver que se van disparando las validaciones
  conforme vamos editando.

Fonk tiene una serie de validaciones ya implementada, así como muchas
que te puedes descargar, también te permite implementar las tuyas
propias sea síncronas a asíncronas.

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Y si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)
