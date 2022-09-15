import { CUSTOM_ELEMENTS_SCHEMA, Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { SearchByLoginPipe } from 'src/app/pipes/search-by-login.pipe';
import { MembersService } from 'src/app/services/members.service';
import { UserListComponent } from './user-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';


xdescribe('Tests unitarios de la clase', () => {

  // const fakeMembers: MemberEntity[] = [
  //   {
  //     login: 'antonio08',
  //     id: '14547103',
  //     avatar_url: 'https://avatars1.githubusercontent.com/u/14547103?v=4',
  //   },
  //   {
  //     login: 'braulioperez',
  //     id: '1457922',
  //     avatar_url: 'https://avatars1.githubusercontent.com/u/1457922?v=4',
  //   },
  //   {
  //     login: 'hrsanti',
  //     id: '13205289',
  //     avatar_url: 'https://avatars1.githubusercontent.com/u/13205289?v=4',
  //   }
  // ];
  // @Injectable()
  // class MockMembersService extends MembersService {
  //   getAll(): Observable<MemberEntity[]> {
  //     return of(fakeMembers);
  //   }
  // }


  it('Al instanciar el componente, se muestra el listado de miembros', () => {

    // //const mockMembersService = new MockMembersService(null);

    // jest.mock('src/app/services/members.service');
    // MembersService.prototype.getAll = () => of(fakeMembers);
    // const mockMembersService = new MembersService(null);

    // const comp = new UserListComponent(mockMembersService);
    
    // // Act
    // comp.ngOnInit();

    // // Assert
    // expect(comp.members.length).toBe(3);
    // expect(comp.members[0].login).toBe('antonio08');
    // expect(comp.members).toBe(fakeMembers);

  });

  it('Añadir', () => {

    // const membersService = new MockMembersService(null);
    // const comp = new UserListComponent(membersService);
    // comp.ngOnInit();
    // comp.newMember = {
    //   id: '7',
    //   login: 'carlos',
    //   avatar_url: 'http://.....'
    // }
    
    // // Act
    // comp.add();

    // // Assert
    // expect(comp.members.length).toBe(4);
    // expect(comp.members[3].login).toBe('carlos');
    // expect(comp.members[3].id).toBe('7');
  });



//   describe('Tests del comportamiento en el DOM', () => {

//     jest.mock('src/app/services/members.service', () => {
//       return function () {
//         return {getAll: () => of(fakeMembers)};
//       };
//     });
  
//     let component: UserListComponent;
//     let fixture: ComponentFixture<UserListComponent>;
  
//     beforeEach(async () => {
//       await TestBed.configureTestingModule({
//         declarations: [
//           UserListComponent,
//           SearchByLoginPipe
//         ],
//         imports: [
//           FormsModule,
//           HttpClientTestingModule
//         ],
//         providers: [
//           // {provide: MembersService, useClass: MockMembersService},
//           // {provide: MembersService, useValue: mockService},
//         ],
//         schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
//       }).compileComponents();
  
//       fixture = TestBed.createComponent(UserListComponent);
//       // component = fixture.componentInstance;
//       fixture.detectChanges();
//     });
  
//     it('Debe aparecer un listado', () => {
//       const login1 = fixture.nativeElement.querySelector('table tbody tr:first-child td:nth-child(3) span') as HTMLTableRowElement;
//       expect(login1.textContent).toContain('antonio08');
//     });
  
//   });
});

