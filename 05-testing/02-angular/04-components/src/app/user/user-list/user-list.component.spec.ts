import { UserListComponent } from './user-list.component';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchByLoginPipe } from 'src/app/pipes/search-by-login.pipe';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'jest';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';


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

describe('Tests del comportamiento en el DOM', () => {

  jest.mock('src/app/services/members.service', () => {
    return function () {
      return {getAll: () => of(fakeMembers)};
    };
  });

  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        UserListComponent,
        SearchByLoginPipe
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        // {provide: MembersService, useClass: MockMembersService},
        // {provide: MembersService, useValue: mockService},
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    // component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe aparecer un listado', () => {
    const login1 = fixture.nativeElement.querySelector('table tbody tr:first-child td:nth-child(3) span') as HTMLTableRowElement;
    expect(login1.textContent).toContain('antonio08');
  });

});
