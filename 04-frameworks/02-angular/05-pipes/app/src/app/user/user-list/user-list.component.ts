import { Component, OnInit } from '@angular/core';
import { MemberEntity } from '../../model';
import { NgFor, NgIf } from '@angular/common';
import { HighlightDirective } from '../../directives/highlight.directive';
import { FormsModule } from '@angular/forms';
import { SearchByLoginPipe } from '../../pipes/search-by-login.pipe';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NgFor, HighlightDirective, FormsModule, NgIf, SearchByLoginPipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  members: MemberEntity[] = [];
  newMember!: MemberEntity;

  add(): void {
    this.members.push(this.newMember);
    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }

  handleFileInput($event: any) {
    const files = $event.target.files as FileList;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.newMember.avatar_url = reader.result as string;
    };
  }

  ngOnInit(): void {
    fetch('https://api.github.com/orgs/lemoncode/members')
      .then((response) => response.json())
      .then((result) => (this.members = result));

    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };
  }
}
