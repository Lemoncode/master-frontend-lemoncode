# Principio de Responsabilidad Única

**Una clase debería tener una, y solo una, razón para cambiar**

El principio de Responsabilidad Única es el más malinterpretado de los 5 prinicpios SOLID debido a su nombre "engañoso".

El nombre da a entender que cada módulo debería hacer una única cosa. Cierto es que hay un principio de buenas prácticas que dice eso, pero no es el de SOLID.

La descripción oficial es la siguiente: "Each software module has one, and only one, reason to change".

Esa "Razón para cambiar" es lo que se intenta asociar con el concepto de "Responsabilidad".

Un ejemplo:

```js
class Employee
{
    getName()
    setName()
    save()
    calculatePay()
    reportHours()
}
```

## ¿Cómo detectar si estamos violando el Principio de Responsabilidad Única?

La respuesta a esta pregunta es bastante subjetiva. **Sin necesidad de obsesionarnos** con ello, podemos detectar situaciones en las que una clase podría dividirse en varias:

### En una misma clase están involucradas dos capas de la arquitectura

Esta puede ser difícil de ver sin experiencia previa. En toda arquitectura, por simple que sea, debería haber una capa de presentación, una de lógica de negocio y otra de persistencia. Si mezclamos responsabilidades de dos capas en una misma clase, será un buen indicio.

- Objetos que se renderizan ellos mismos
- Objetos que se guardan ellos mismos

### El número de métodos públicos

Si una clase hace muchas cosas, lo más probable es que tenga muchos métodos públicos, y que tengan poco que ver entre ellos. Detecta cómo puedes agruparlos para separarlos en distintas clases. Algunos de los puntos siguientes te pueden ayudar.

### Los métodos que usan cada uno de los campos de esa clase

Si tenemos dos campos, y uno de ellos se usa en unos cuantos métodos y otro en otros cuantos, esto puede estar indicando que cada campo con sus correspondientes métodos podrían formar una clase independiente. Normalmente esto estará más difuso y habrá métodos en común, porque seguramente esas dos nuevas clases tendrán que interactuar entre ellas.

Hay herramientas de análisis que miden el LCOM (Lack Cohesion of Methods) de las clases de un software para dar una pista de aquellas clases que parecen estar violando el SRP.

### Por el número de "import"

Si necesitamos importar demasiadas clases/librerías/funciones externas para hacer nuestro trabajo, es posible que estemos haciendo trabajo de más. También ayuda fijarse a qué paquetes pertenecen esos "import". Si vemos que NO se agrupan con facilidad, puede que nos esté avisando de que estamos haciendo cosas muy diferentes.

### Nos cuesta testear la clase

Si no somos capaces de escribir tests unitarios sobre ella, o no conseguimos el grado de granularidad que nos gustaría, es momento de plantearse dividir la clase en dos.

### Cada vez que escribes una nueva funcionalidad, esa clase se ve afectada

Si una clase se modifica a menudo, es porque está involucrada en demasiadas cosas.

```
# unix
git log --pretty=format: --since="1 year ago" --name-only | sort | uniq -c | sort -rg | head -10 
```

```
# windows
git effort --above 50  -- --after="one year ago"
```

### Por el número de líneas

A veces es tan sencillo como eso. Si una clase es demasiado grande, intenta dividirla en clases más manejables.

En general no hay reglas de oro para estar 100% seguros. La práctica te irá haciendo ver cuándo es recomendable que cierto código se mueva a otra clase, pero estos indicios te ayudarán a detectar algunos casos donde tengas dudas.

## Ejercicios

### Ejercicio 1

```js
class Order
{
    calculateTotalSum(){/*...*/}
    getItems(){/*...*/}
    getItemCount(){/*...*/}
    addItem(item){/*...*/}
    deleteItem(item){/*...*/}

    printOrder(){/*...*/}
    showOrder(){/*...*/}

    load(){/*...*/}
    save(){/*...*/}
    update(){/*...*/}
    delete(){/*...*/}
}
```

Solución

```js
class Order
{
    calculateTotalSum(){/*...*/}
    getItems(){/*...*/}
    getItemCount(){/*...*/}
    addItem(item){/*...*/}
    deleteItem(item){/*...*/}
}

class OrderRepository
{
    load(orderID){/*...*/}
    save(order){/*...*/}
    update(order){/*...*/}
    delete(order){/*...*/}
}

class OrderViewer
{
    printOrder(order){/*...*/}
    showOrder(order){/*...*/}
}
```

### Ejercicio 2

```js
class User {

    ...
    mapFormat() {
        return {
          name: this.user.name + this.user.firstName,
          userName: this.user.username,
          rank: this.user.rank,
          score: this.user.score
        };
    }
 
    validateUser() {
        if (this.user.name) {
          return true;
        } else {
          throw new UnknownUserException("Name is mandatory");
        }
    }
 
    fetchUserFromDatabase(userId) {
        this.user = this.userRepository.find(userId);
    }
 
    ...
}
```

Solución

```js
class User {
    ...
}

class UserFormatter {
    map(user: User) {
        return {
          name: user.name + user.firstName,
          userName: user.username,
          rank: user.rank,
          score: user.score
        };
    }
}

class UserValidator {
    validate(user: User) {
        if (user.name) {
          return true;
        } else {
          throw new NameRequiredException("Name is required");
        }
    }
}

class UserRepository {
    fetchUserFromDatabase(userId) {
        return this.userRepository.find(userId);
    }
}
```

### Ejercicio 3

```js
class Book {
 
    getTitle() {
        return "A Great Book";
    }
 
    getAuthor() {
        return "Carlos Herrera";
    }
 
    turnPage() {
        // pointer to next page
    }

    getCurrentPage() {
        return "current page content";
    }
 
    printCurrentPage() {
        // send to the printer
    }
}
```

Solución

```js
class Book {
 
    getTitle() {
        return "A Great Book";
    }
 
    getAuthor() {
        return "Carlos Herrera";
    }
 
    turnPage() {
        // pointer to next page
    }
 
    getCurrentPage() {
        return "current page content";
    }
 
}

class Printer {
 
    printPage(page) {
        // send to the printer
    }
 
}
```

Con un poco más de esfuerzo, podemos añadir más métodos de impresión

```typescript
class Book {
 
    getTitle() {
        return "A Great Book";
    }
 
    getAuthor() {
        return "John Doe";
    }
 
    turnPage() {
        // pointer to next page
    }
 
    getCurrentPage() {
        return "current page content";
    }
 
}
 
interface Printer {
    printPage(page): string;
}
 
class PlainTextPrinter implements Printer {

    printPage(page): string {
        const text = page.title + ... ;
        return text;
    }
}
 
class HtmlPrinter implements Printer {
    printPage(page): string {
        const html = '<div style="single-page">' + page.title + ... '</div>';
        return html
    }
}
```

## Ejercicio 4

Aunque una clase únicamente tenga un método, no nos asegura que tenga solamente una única razón para cambiar.

```typescript
class IdeaController extends Controller
{
  rateAction() {
    // Getting parameters from the url
    ideaId = this.url.getParam('id');
    rating = this.url.getParam('rating');
    // Building database connection
    db = new PDO([
      'host' => 'localhost',
      'username' => 'demo',
      'password' => '',
      'dbname' => 'demo'
    ]);
    // Finding the idea in the database
    sql = 'SELECT * FROM ideas WHERE idea_id = ?';
    stmt = db.prepare(sql);
    stmt.bindParam(1, ideaId);
    stmt.execute();
    row = stmt.fetch();
    if (!row) {
      throw new Exception('Idea does not exist');
    }
    // Building the idea from the database
    idea = new Idea();
    idea.setId(row['id']);
    idea.setTitle(row['title']);
    idea.setDescription(row['description']);
    idea.setRating(row['rating']);
    idea.setVotes(row['votes']);
    idea.setAuthor(row['email']);
    // Add user rating (internally it will increment votes by 1)
    idea.addRating(rating);
    // Save it to the database
    sql = 'UPDATE ideas SET votes = ?, rating = ? WHERE idea_id = ?';
    stmt = db.prepare(sql);
    stmt.bindParam(1, ideaId);
    stmt.bindParam(2, idea.getVotes());
    stmt.bindParam(3, idea.getRating());
    stmt.execute();
    // Redirect to view idea page
    this.redirect('/idea/'.ideaId);
  }
}
```

Solución "aceptable"

```typescript
class IdeaController extends Controller
{
  rateAction() {
    // Getting parameters from the url
    ideaId = this.url.getParam('id');
    rating = this.url.getParam('rating');

    // Retrieving the idea from the database
    ideaRepository = new MySQLIdeaRepository(); 
    ideaEntity = ideaRepository.find(ideaId);

    // Add user rating (internally it will increment votes by 1)
    ideaEntity.addRating(rating);

    // Save it to the database
    ideaRepository.save(ideaEntity);

    // Redirect to view idea page
    this.redirect('/idea/'.ideaEntity.getId());
  }
}
```

## Anti-patrones

- God Object: un objeto que lo sabe todo y lo hace todo.