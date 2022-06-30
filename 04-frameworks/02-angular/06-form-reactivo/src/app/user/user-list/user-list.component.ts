import { Component, OnInit } from '@angular/core';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { MembersService } from 'src/app/services/members.service';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  members: MemberEntity[] = [];
  newMember: MemberEntity;
  memberSelected: MemberEntity;

  editForm: UntypedFormGroup;
  idControl: UntypedFormControl;
  loginControl: UntypedFormControl;
  avatarControl: UntypedFormControl;

  constructor(private membersService: MembersService, private fb: UntypedFormBuilder) {
    this.membersService.getAll().then(
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

    this.idControl = this.editForm.get('id') as UntypedFormControl;
    this.loginControl = this.editForm.get('login') as UntypedFormControl;
    this.avatarControl = this.editForm.get('avatar_url') as UntypedFormControl;
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
  }
}
