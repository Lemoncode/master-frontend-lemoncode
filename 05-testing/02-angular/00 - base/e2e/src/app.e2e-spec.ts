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

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });


  it('add member', () => {
    page.navigateTo('');
    page.getElementByCss('input[name=name]').sendKeys('carlos');
    page.getElementByCss('form button').click();
    // .....
  });

});
