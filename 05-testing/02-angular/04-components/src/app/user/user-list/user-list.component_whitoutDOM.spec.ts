import { UserListComponent } from './user-list.component';
import { of, Observable } from 'rxjs';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { MembersService } from 'src/app/services/members.service';
import 'jest';
import { Injectable } from '@angular/core';


const fakeMembers: MemberEntity[] = [
  {
    login: 'antonio08',
    id: '14547103',
    avatar_url: 'https://avatars1.githubusercontent.com/u/14547103?v=4',
  },
  {
    login: 'braulioperez',
    id: '1457922',
    avatar_url: 'https://avatars1.githubusercontent.com/u/1457922?v=4',
  },
  {
    login: 'hrsanti',
    id: '13205289',
    avatar_url: 'https://avatars1.githubusercontent.com/u/13205289?v=4',
  }
];

@Injectable()
class MockMembersService extends MembersService {
  constructor(_: any) {
    super(_);
  }

  override getAll(): Observable<MemberEntity[]> {
    return of(fakeMembers);
  }
}

describe('Tests unitarios de la clase', () => {


  jest.mock('src/app/services/members.service', () => {
    return function () {
      return {getAll: () => of(fakeMembers)};
    };
  });

  it('get Members from service on init', () => {
    const mock = new MockMembersService(null);
    const component = new UserListComponent(mock);
    component.ngOnInit();
    expect(component.members).toBe(fakeMembers);
  });

  it('method add() adds newMember to members', () => {
    // Setup
    const mock = new MockMembersService(null);
    const component = new UserListComponent(mock);
    component.members = [...fakeMembers];
    component.newMember = {login: 'carlos', id: '8', avatar_url: 'url'};

    // Act
    component.add();

    // Assert
    expect(component.members.length).toBe(4);
    expect(component.members[3].login).toBe('carlos');
  });

  it('method select() stores his argument in memberSelected', () => {
    // ...
  });
});
