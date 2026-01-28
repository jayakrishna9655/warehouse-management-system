import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignComponent } from "../Component/sign/sign.component";
import { LoginComponent } from '../Component/login/login.component';
import { DashboardComponent } from '../Component/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'WareHouse';
}
