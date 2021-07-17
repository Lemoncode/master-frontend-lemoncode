Start from **02-svelte-typescript**

No todos los _stores_ deberían poder ser modificados por quien tiene una referencia a ellos. Por ejemplo, puedes tener un _store_ que represente la posición del ratón o la geolocalización del usuario, y no tiene sentido poder establecer esos valores desde "fuera" del _store_. Para esos casos, tenemos _readables stores_.

