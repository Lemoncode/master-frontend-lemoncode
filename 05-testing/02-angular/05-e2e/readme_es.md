# Testeo e2e

En el testing End to end las pruebas se hacen desde el punto de vista del usuario que utiliza la aplicación.

Angular, a través de la librería _protractor_ nos proporciona un simulador de un browser que nos permite simular la interacción del usuario con la aplicación.

Funciona internamente con Selenium.

## Ejemplo

_e2e/src/app.e2e-spec.ts_

```typescript
import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display h1 with the test Angular Testing', () => {
    page.navigateTo('');
    expect(page.getTitleText()).toEqual('Angular Testing');
  });

  it('add member', () => {
    page.navigateTo('');
    page.getElementByCss('input[name=name]').sendKeys('carlos');
    page.getElementByCss('form button').click();
    // .....
  });
});
```

Se recomienda encapsular los métodos de navegación, obtención de elementos, etc en otra clase auxiliar que permita la reutilización de código entre los diferentes test.

_e2e/src/app.po.ts_

```typescript
import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  navigateTo(url): Promise<unknown> {
    return browser.get(browser.baseUrl + url) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  getElementByCss(selector: string) {
    return element(by.css(selector));
  }
});
```