import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators, UntypedFormBuilder } from '@angular/forms';
import { MemberEntity } from 'src/app/model/MemberEntity';


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

  editForm: UntypedFormGroup;
  idControl: UntypedFormControl;
  loginControl: UntypedFormControl;
  avatarControl: UntypedFormControl;

  constructor(private fb: UntypedFormBuilder) {
    this.createEditForm();
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.editForm.patchValue(this.member);
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

  handleEditFileInput(files: FileList) {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.avatarControl.setValue(reader.result);
    };
  }

  save() {
    const member = this.editForm.value;
    this.saveEvent.emit(member);
  }
}
