import { Component, OnInit } from '@angular/core';
import { MemberEntity } from '../../model/member-entity';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  members: MemberEntity[] = [];

  constructor(service: MembersService) { 
    service.getAll().then( membersResponse => this.members = membersResponse);
  }

  ngOnInit(): void {
  }

}