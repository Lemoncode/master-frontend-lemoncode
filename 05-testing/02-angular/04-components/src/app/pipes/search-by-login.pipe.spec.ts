import { SearchByLoginPipe } from './search-by-login.pipe';

xdescribe('SearchByLoginPipe', () => {
  it('create an instance', () => {
    const pipe = new SearchByLoginPipe();
    expect(pipe).toBeTruthy();
  });
});
