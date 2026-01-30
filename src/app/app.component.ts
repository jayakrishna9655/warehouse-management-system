import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignComponent } from "../Component/sign/sign.component";
import { LoginComponent } from '../Component/login/login.component';
import { DashboardComponent } from '../Component/dashboard/dashboard.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WareHouse';
  constructor(  private router:Router) {}
  logout() {
  // Clear all session data
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  
  // Redirect to login page
  this.router.navigate(['/login']);
}
}
