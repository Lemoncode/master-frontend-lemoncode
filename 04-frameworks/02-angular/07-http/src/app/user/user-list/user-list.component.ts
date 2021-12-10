import { Component, OnInit } from '@angular/core';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { MembersService } from 'src/app/services/members.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  members: MemberEntity[] = [];
  newMember: MemberEntity;
  memberSelected: MemberEntity;

  editForm: FormGroup;
  idControl: FormControl;
  loginControl: FormControl;
  avatarControl: FormControl;

  files: FileList;

  constructor(private membersService: MembersService, private fb: FormBuilder) {
    this.membersService.getAll().subscribe(
      members => this.members = members
    );

    this.newMember = {
      id: '',
      login: '',
      avatar_url: ''
    };

    this.createEditForm();

    // this.loginControl.valueChanges.subscribe(
    //   value => console.log({value})
    // );

    // this.editForm.valueChanges.subscribe(
    //   value => console.log({value})
    // );
  }

  ngOnInit(): void {
  }

  createEditForm() {
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      login: ['', [Validators.required, Validators.minLength(6)]],
      avatar_url: ''
    });

    this.idControl = this.editForm.get('id') as FormControl;
    this.loginControl = this.editForm.get('login') as FormControl;
    this.avatarControl = this.editForm.get('avatar_url') as FormControl;
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

  select(member: MemberEntity) {
    this.memberSelected = {...member};

    // this.editForm.setValue(this.memberSelected);
    this.editForm.patchValue(this.memberSelected);
  }

  save() {
    const formData = new FormData();
    formData.append("file", this.files[0]);
    fetch("http://localhost:8000/user/file", { method: 'POST', body: formData });

    if (this.editForm.valid) {
      this.members = [...this.members];
      const member = this.editForm.value;
      const index = this.members.findIndex(item => item.id === member.id);
      this.members.splice(index, 1, member); 
    }
  }

  handleEditFileInput(files: FileList) {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.avatarControl.setValue(reader.result);
    };
    this.files = files;
  }
}
