# Creando un repo en Github

Vamos ahora a enlazar el repo local que hemos creado con uno en Github.

OJO en el repo del Máster Front End no hemos añadido este paso (no hay repo local), para evitar crear un repo dentro de un repo, y también enlazarlo a un repo de una cuenta en concreto.

Así que vamos a crearlo en directo :), podéis seguirme (puede que este paso nos de problemas a más de uno).

Vamos a github, creamos un repo en nuestra cuenta.

Creamos un nuevo repo desde Github, IMPORTANTE:
  - Dejalo como público (podría ser privado).

  - No le pongas un README (dejalo desmarcado).

  - No añadas un `.gitignore` ni una licencia.

  Ahora nos vamos a la carpeta de nuestro proyecto, y le indicamos que el repo local que hemos creado tire del repo de Github (cambiamos el Origin).

```bash
git remote add origin <la url a tu repo del clone>
```

Vamos a hacer un add y un commit de los cambios que hemos metido en el proyecto:

```bash
git add .
```

```bash
git commit -m "Title updated"
```

Y ahora vamos a hacer un push de los cambios al repo de Github:

```bash
git push --set-upstream origin main
```

Y ya lo tenemos subido a Github.