# 03 css prop detalles

## Resumen

Vamos a profundizar un poco más en como funciona la aproximación de props.

## Paso a Paso

Partimos de _03-emotion-react-css_ instalamos:

```bash
npm install
```

Cuando trabajamos con emotion podemos anidar estilos y usar
operadores de SASS, por ejemplo vamos a añadir estilado
para que cuando pasemos el ratón por encima del _h1_
cambie de color:

```diff
const color = "red";

const h1Class = css`
  color: ${color};
+ &:hover {
+  color: blue
+ }
`;

export const App = () => {
  return <h1 css={h1Class}>Hello React !!</h1>;
};
```

> Muy importante aquí instalar el plugin de styled components en
> VSCode para ver ese string con sintax highlighting.

Si lo prefieres también puedes usar notación de objeto:

```diff
const color = "red";

+ const h1Class = {
+  color: color;
+   "&:hover": {
+    color: "blue";
+   }
+ };

const h1Class = css`
  color: ${color};
  &:hover {
    color: blue;
  }
`;

export const App = () => {
  return <h1 css={h1Class}>Hello React !!</h1>;
};
```

# ¿Te apuntas a nuestro máster?

Si te ha gustado este ejemplo y tienes ganas de aprender Front End
guiado por un grupo de profesionales ¿Por qué no te apuntas a
nuestro [Máster Front End Online Lemoncode](https://lemoncode.net/master-frontend#inicio-banner)? Tenemos tanto edición de convocatoria
con clases en vivo, como edición continua con mentorización, para
que puedas ir a tu ritmo y aprender mucho.

Si tienes ganas de meterte una zambullida en el mundo _devops_
apuntate nuestro [Bootcamp devops online Lemoncode](https://lemoncode.net/bootcamp-devops#bootcamp-devops/inicio)

Y si lo que necesitas es ponerete al día en Backend, con nuestro Bootcamp
podrás parender stack node + documental y .net + relacional [Bootcamp Backend](https://lemoncode.net/bootcamp-backend#bootcamp-backend/banner)
