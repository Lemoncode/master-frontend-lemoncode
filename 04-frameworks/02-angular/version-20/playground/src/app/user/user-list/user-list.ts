import { Component, OnInit } from '@angular/core';
import { MemberEntity } from '../../models';
import { Highlight } from '../../directives/highlight';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SearchByLoginPipe } from '../../pipes/search-by-login-pipe';
import { Members } from '../../services/members';

@Component({
  selector: 'app-user-list',
  imports: [Highlight, FormsModule, SearchByLoginPipe, ReactiveFormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  members: MemberEntity[] = [];
  newMember!: MemberEntity;
  memberSelected!: MemberEntity;

  editForm!: FormGroup;
  idControl!: FormControl;
  loginControl!: FormControl;
  avatarControl!: FormControl;

  constructor(
    private membersService: Members,
    private fb: FormBuilder,
  ) {}

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
    this.members = [
      { id: 'foo', login: 'fooo', avatar_url: '' },
      { id: 'bioa', login: 'bioao', avatar_url: '' },
      { id: 'bb', login: 'bbo', avatar_url: '' },
    ];
    // this.membersService.getAll().then((members) => (this.members = members));

    this.newMember = {
      id: '',
      login: '',
      avatar_url: '',
    };

    this.createEditForm();
  }

  createEditForm(): void {
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      login: ['', [Validators.required, Validators.minLength(6)]],
      avatar_url: '',
    });

    this.idControl = this.editForm.get('id') as FormControl;
    this.loginControl = this.editForm.get('login') as FormControl;
    this.avatarControl = this.editForm.get('avatar_url') as FormControl;
  }

  select(member: MemberEntity): void {
    this.memberSelected = { ...member };
    this.editForm.patchValue(this.memberSelected);
  }

  handleEditFileInput($event: any): void {
    const files = $event.target.files as FileList;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.avatarControl.setValue(reader.result);
    };
  }

  save() {
    if (this.editForm.valid) {
      this.members = [...this.members];
      const member = this.editForm.value;
      const index = this.members.findIndex((i) => i.id === member.id);
      this.members.splice(index, 1, member);
    }
  }
}
