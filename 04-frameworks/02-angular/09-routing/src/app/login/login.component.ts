import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginType: 'student' | 'teacher';
  constructor(private router: Router, private route: ActivatedRoute) {
    // Si esta fuera la url: https://lemoncode.net/master-frontend/login?type="student"

    // En forma de observable
    this.route.queryParams.subscribe(
      queryParams => this.loginType = queryParams['type']
    );

    // Como snapshot
    this.loginType = this.route.snapshot.queryParams['type'];
   }

  ngOnInit(): void {
  }

  onLoginSuccess() {
    // ...
    this.router.navigate(['/users']);
  }

}
