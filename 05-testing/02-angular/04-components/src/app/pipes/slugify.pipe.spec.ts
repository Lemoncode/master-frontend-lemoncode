import { SlugifyPipe } from './slugify.pipe';

describe('SlugifyPipe', () => {
  let pipe: SlugifyPipe;

  beforeEach(() => {
    pipe = new SlugifyPipe();
  });

  it('Must return string grouped by hyphen and lowercase', () => {
    expect(pipe.transform('Hello World it Work')).toEqual('hello-world-it-work');
  });

  it('Must trim spaces', () => {
    expect(pipe.transform('   Hello World   ')).toEqual('hello-world');
  });

  it('Works with numbers', () => {
    expect(pipe.transform('The top 10 films ever')).toEqual('the-top-10-films-ever');
  });

  it('Works with hyphens', () => {
    expect(pipe.transform('The top 10 front-end frameworks')).toEqual('the-top-10-front-end-frameworks');
  });

  // it('Removes weird characters', () => {
  //   expect(pipe.transform('The tôp 10 front-ènd frameworks!')).toEqual('the-top-10-frontend-frameworks');
  // });
});
