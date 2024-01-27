import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type LoginType = 'student' | 'teacher';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginType: LoginType = 'student';

  constructor(private router: Router, private route: ActivatedRoute) {
    // Si esta fuera la url: https://lemoncode.net/master-frontend/login?type="student"
    this.route.queryParams.subscribe((queryParams) => {
      this.loginType = queryParams['type'];
      console.log(this.loginType);
    });
    
    this.loginType = this.route.snapshot.queryParams['type'];
  }

  onLoginSuccess() {
    this.router.navigate(['/users']);
  }
}
