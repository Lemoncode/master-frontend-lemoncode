# Formulario de Server Action con Resend

Ya hemos tenido un primera experiencia con las **Server Actions**, vamos a seguir explorándolas, esta vez cubriendo un caso muy común, implementar un formulario de contacto, en esta ocasión utilizaremos el servicio [Resend](https://resend.com/) para enviar correos electrónicos de forma sencilla.

La idea es que cuando un usuario se suscriba a nuestra newsletter que recibamos un correo, esta funcionalidad la tenemos tanto en el aside, como en el footer de nuestra página.

> A tener en cuenta, también podríamos habernos integrado con una API tipo mail chimp para enviar directamente el correo, pero la idea de este ejemplo es cubrir el típico caso de formulario de contacto.

Como en el ejemplo anterior ya dejamos la configuración de server actions lista, sólo tenemos que centrarnos en implementar el formulario.

Para enviar correos, podemos utilizar un sinfín de proveedores, en nuestro caso elegimos **Resend** que ofrece un plan gratuito.

El único paquete que hace falta agregar es la librería de **Resend**:

```bash
npm install resend
```

A continuación, necesitamos configurar una cuenta en [Resend](https://resend.com/) para obtener una clave API, puedes crear una con el plan gratuito y para este ejemplo no te preocupes por la configuración del dominio; para este ejemplo, usaremos `onboarding@resend.dev` para enviar correos (si más adelante quieres un servicio de este tipo asociado a tu dominio, tendrás que validarlo).

Una vez que tengas la clave, agrégala a tus variables de entorno en el archivo `.env`.

_.env_

```
FROM_EMAIL=your_verified_email_here
TO_EMAIL=recipient_email_here
RESEND_API_KEY=your_resend_api_key_here
```

Y también añade la configuración en tu archivo `astro.config.mjs`:

```diff
export default defineConfig({
  // other configurations...
  env: {
    schema: {
+      RESEND_API_KEY: envField.string({
+        context: 'server',
+        access: 'secret',
+        optional: false,
+        default: 'INFORM_VALID_TOKEN',
+      }),
+    FROM_EMAIL: envField.string({
+        context: 'server',
+        access: 'secret',
+        optional: false,
+        default: 'INFORM_VALID_EMAIL',
+      }),
+    TO_EMAIL: envField.string({
+        context: 'server',
+        access: 'secret',
+        optional: false,
+        default: 'INFORM_VALID_EMAIL',
+      }),
      CONTENT_ISLAND_SECRET_TOKEN: envField.string({
        context: 'server',
        access: 'secret',
        optional: false,
        default: 'INFORM_VALID_TOKEN',
      }),
    },
  },
});
```

## Creando nuestra acción

Dentro de _./src/actions/index.ts_, agregamos una nueva acción que manejará el envío de correos electrónicos:

```diff
+import { Resend } from 'resend';
+import { RESEND_API_KEY, FROM_EMAIL, TO_EMAIL } from 'astro:env/server';
+import { z } from 'astro:schema';

+const resend = new Resend(RESEND_API_KEY);

export const server = {
  addLike: defineAction<LikesResponse>({
    async handler(slug) {
      return { likes: await addLike(slug) };
    },
  }),
  getLikes: defineAction<LikesResponse>({
    async handler(slug) {
      return { likes: await getLikes(slug) };
    },
  }),
+  sendSubscription: defineAction({
+    accept: 'form',
+    input: z.object({
+      email: z.string().email('Invalid email'),
+    }),
+    handler: async input => {
+      try {
+        const { email } = input;
+        await resend.emails.send({
+          from: FROM_EMAIL,
+          to: TO_EMAIL,
+          subject: 'Hello World',
+          html: `<p>Congrats on sending your <strong>${email}</strong>!</p>`,
+        });
+        return { success: true, message: 'E-mail sent successfully ✅' };
+      } catch (error) {
+        return { success: false, message: 'There was an error sending the e-mail ❌' };
+      }
+    },
+  }),
};
```

### Desglose rápido:

- Validamos la entrada del formulario con Zod (para asegurarnos de que sólo pasen correos válidos)
- Llamamos a Resend para enviar el correo
- Devolvemos una respuesta simple de éxito o error para la interfaz de usuario

## Conectando el formulario

Ahora podemos conectar esta acción a nuestros formularios de suscripción. Primero, actualizaremos el componente de newsletter amplio.

_./src/pods/newsletter/components/newsletter-wide.astro_

```diff
<section >
    <form
+      id="newsletter-form-wide"
+      method="POST"
    >
    //(...)
    </form>
</section>


+<script>
+  import { actions } from 'astro:actions';
+  const form = document.getElementById('newsletter-form-wide');

+  const handleSubmit = async (event: Event) => {
+    event.preventDefault();
+    const form = event.target as HTMLFormElement;
+    const sendFormData = new FormData(form);
+    const result = await actions.sendSubscription(sendFormData);
+    if (result.data?.success) {
+      form.reset();
+    }
+  };

+  if (form && form instanceof HTMLFormElement) {
+    form.addEventListener('submit', e => handleSubmit(e));
+  }
+</script>
```

### Qué está pasando aquí:

- Importamos el objeto `actions` desde `astro:actions`, lo que nos permite llamar a nuestras server actions desde el lado del cliente
- Agregamos un _event listener_ al evento `submit` del formulario para manejar el envío
- Prevenimos el comportamiento por defecto del formulario para controlarlo con JavaScript
- Creamos un objeto `FormData` desde el formulario y llamamos a la acción `sendSubscription` con estos datos
- Verificamos el resultado de la acción y, si fue exitoso, reiniciamos el formulario

Astro te permite usar _server actions_ directamente en formularios HTML, pero aquí usamos JavaScript para tener más control sobre el proceso de envío y manejar la respuesta adecuadamente.

## Reutilizando la lógica de envío

Ahora podemos reutilizar la misma función `handleSubmit` en el otro componente de newsletter.
Primero, crearemos un nuevo archivo llamado `newsletter.business.ts` en la carpeta `newsletter` para exportar la función.

_./src/pods/newsletter/newsletter.business.ts_

```ts
import { actions } from "astro:actions";

export const handleSubmit = async (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const sendFormData = new FormData(form);
  const result = await actions.sendSubscription(sendFormData);
  if (result.data?.success) {
    form.reset();
  }
};
```

Ahora podemos importar y usar esta función en `newsletter-wide.astro`.

_./src/pods/newsletter/components/newsletter-wide.astro_

```diff
<script>
-  import { actions } from 'astro:actions';
+  import { handleSubmit } from '../newsletter.business';
  const form = document.getElementById('newsletter-form-wide');

-  const handleSubmit = async (event: Event) => {
-    event.preventDefault();
-    const form = event.target as HTMLFormElement;
-    const sendFormData = new FormData(form);
-    const result = await actions.sendSubscription(sendFormData);
-    if (result.data?.success) {
-      form.reset();
-    }
-  };

  if (form && form instanceof HTMLFormElement) {
     form.addEventListener('submit', e => handleSubmit(e));
  }
</script>
```

Finalmente, usaremos esta misma función en el otro componente de newsletter.

_./src/pods/newsletter/components/newsletter-mini.astro_

```diff
    <form
      class="border-text relative flex items-center justify-between gap-2 rounded-xl border py-2 pr-2 pl-4"
+      id="newsletter-form-mini"
+      method="POST"
      >
     ...
    </form>
</section>

+<script>
+  import { handleSubmit } from '../newsletter.business';
+  const form = document.getElementById('newsletter-form-mini');

+  if (form && form instanceof HTMLFormElement) {
+    form.addEventListener('submit', e => handleSubmit(e));
+  }
+</script>
```

¡Y eso es todo!

Ahora tenemos un formulario de newsletter completamente funcional que usa **Astro Server Actions + Resend** para enviar correos electrónicos, lo mismo que hemos enviado un correo, podríamos haber utilizado un servicio externo para, por ejemplo, suscribir al usuario a una lista de correos.

En el próximo video vamos a ver como añadir transiciones a la navegación entre páginas.
