# Debugging

¿Y si nos hace falta depurar el código? ¿Cómo podemos hacerlo?

Si queremos depurar server side, añadimos un _launch.json_

Para ello podemos irnos a: Run and Debug > Create a launch.json file

Y elegir nodejs

Nos crea un _launch.json_, y lo reemplazamos por esto

_.vscode/launch.json_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "command": "./node_modules/.bin/astro dev",
      "name": "Development server",
      "request": "launch",
      "type": "node-terminal"
    }
  ]
}

```

Y ahora ejecutamos desde el terminal de debug:

```bash
npm run dev
```
