# Testeo de componentes

Los componentes son clases ts + html + css.

Para testear el ts de forma unitaria, podemos usar jest tal cual. Con las consideraciones de siempre:

- mockear posibles dependencia
- inyectar los mocks en el constructor

Para probar la interacción con el DOM, tendremos que recurrir, como en las directivas, a crear un entorno de testing configurando un módulo expresamente para el test.

## Testeo del ts

Vamos a testear el componente _UserList_. Este es su código:

_src/app/user/user-list/user-list.component.ts_

```typescript
import { Component, OnInit } from '@angular/core';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  members: MemberEntity[] = [];
  newMember: MemberEntity;
  memberSelected: MemberEntity;

  constructor(private membersService: MembersService) {}

  ngOnInit(): void {
    this.membersService.getAll().subscribe(
      members => this.members = members
    );

    this.newMember = {
      id: '',
      login: '',
      avatar_url: ''
    };
  }

  add(): void {
    this.members.push(this.newMember);
    this.newMember = {
      id: '',
      login: '',
      avatar_url: ''
    };
  }

  handleFileInput(files: FileList): void {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.newMember.avatar_url = reader.result as string;
    };
  }

  select(member: MemberEntity): void {
    this.memberSelected = {...member};

  }

  save(member: MemberEntity): void {
    this.members = [...this.members];
    const index = this.members.findIndex(item => item.id === member.id);
    this.members.splice(index, 1, member);
  }

}
```

Podemos testear la clase siguiendo las prácticas que hemos visto hasta ahora:

_src/app/user/user-list/user-list.component.spec.ts_

```typescript
import { UserListComponent } from './user-list.component';
import { of, Observable } from 'rxjs';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { MembersService } from 'src/app/services/members.service';
import { SearchByLoginPipe } from 'src/app/pipes/search-by-login.pipe';
import { FormsModule } from '@angular/forms';
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
  getAll(): Observable<MemberEntity[]> {
    return of(fakeMembers);
  }
}

describe('Tests unitarios de la clase', () => {

  it('get Members from service on init', () => {
    const mock = new MockMembersService(null);
    const component = new UserListComponent(mock);
    component.ngOnInit();
    expect(component.members).toBe(fakeMembers);
  });

  it('method add() adds newMember to members', () => {
    // Setup
    const component = new UserListComponent(null);
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
```

## Probando la interacción con el DOM

Para probar la interacción con el DOM recurrimos a las herramientas de testeo de Angular: TestBed, ComponentFixture, By, etc.

_src/app/user/user-list/user-list.component.spec.ts_

```diff
import { UserListComponent } from './user-list.component';
import { of, Observable } from 'rxjs';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { MembersService } from 'src/app/services/members.service';
+ import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchByLoginPipe } from 'src/app/pipes/search-by-login.pipe';
import { FormsModule } from '@angular/forms';
- import { Injectable } from '@angular/core';
+ import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
+ import { mocked } from 'ts-jest/utils';
+ import { HttpClientTestingModule } from '@angular/common/http/testing';


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
  getAll(): Observable<MemberEntity[]> {
    return of(fakeMembers);
  }
}

describe('Tests unitarios de la clase', () => {

  it('get Members from service on init', () => {
    const mock = new MockMembersService(null);
    const component = new UserListComponent(mock);
    component.ngOnInit();
    expect(component.members).toBe(fakeMembers);
  });

  it('method add() adds newMember to members', () => {
    // Setup
    const component = new UserListComponent(null);
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

+ describe('Tests del comportamiento en el DOM', () => {
+
+  jest.mock('src/app/services/members.service');
+  const mockService = mocked(MembersService, true);
+
+  let component: UserListComponent;
+  let fixture: ComponentFixture<UserListComponent>;
+
+  beforeEach(async () => {
+    await TestBed.configureTestingModule({
+      declarations: [
+        UserListComponent,
+        SearchByLoginPipe
+      ],
+      imports: [
+        FormsModule,
+        HttpClientTestingModule
+      ],
+      providers: [mockService],
+      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
+    }).compileComponents();
+
+    fixture = TestBed.createComponent(UserListComponent);
+    component = fixture.componentInstance;
+    fixture.detectChanges();
+  });
+
+  it('Debe aparecer un listado', () => {
+    console.log(component.members);
+    component.members = [...fakeMembers];
+    fixture.detectChanges();
+    const login1 = fixture.nativeElement.querySelector('table tbody tr:first-child td:nth-child(3) span') as HTMLTableRowElement;
+    expect(login1.textContent).toContain('antonio08');
+  });
+
+ });
```