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
