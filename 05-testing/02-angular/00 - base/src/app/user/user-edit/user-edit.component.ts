import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { MemberEntity } from 'src/app/model/MemberEntity';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnChanges {

  @Input()
  member: MemberEntity;

  @Output()
  saveEvent: EventEmitter<MemberEntity> = new EventEmitter();

  editForm: FormGroup;
  idControl: FormControl;
  loginControl: FormControl;
  avatarControl: FormControl;

  constructor(private fb: FormBuilder) {
    this.createEditForm();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.editForm.patchValue(this.member);
  }

  createEditForm(): void {
    this.editForm = this.fb.group({
      id: ['', Validators.required],
      login: ['', [Validators.required, Validators.minLength(6)]],
      avatar_url: ''
    });

    this.idControl = this.editForm.get('id') as FormControl;
    this.loginControl = this.editForm.get('login') as FormControl;
    this.avatarControl = this.editForm.get('avatar_url') as FormControl;
  }

  handleEditFileInput(files: FileList): void {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.avatarControl.setValue(reader.result);
    };
  }

  save(): void {
    const member = this.editForm.value;
    this.saveEvent.emit(member);
  }

}
