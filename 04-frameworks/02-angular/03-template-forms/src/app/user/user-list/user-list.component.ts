import { Component, OnInit } from '@angular/core';
import { MemberEntity } from 'src/app/model/MemberEntity';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  members: MemberEntity[] = [];
  newMember: MemberEntity;

  constructor() {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => this.members = json);

    this.newMember = {
      id: '',
      login: '',
      avatar_url: ''
    };
  }

  ngOnInit(): void {
  }

  add() {
    this.members.push(this.newMember);
    this.newMember = {
      id: '',
      login: '',
      avatar_url: ''
    };
  }

  handleFileInput(files: FileList) {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.newMember.avatar_url = reader.result as string;
    };
  }

}
