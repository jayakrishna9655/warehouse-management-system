import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '/Credo System/JavaProject/Warehouse_ans/WareHouse/src/models/user';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterOutlet],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
name:any;
email:any
Password:any
constructor(private http: HttpClient , private router:Router) {}
user: User = {
    username: '',
    password: '',
    role:''
  };
getdata(){

  console.log("payload",this.user)
 let url = "http://localhost:8080/api/users/login";
    
    this.http.post(url, this.user).subscribe({
  next: (res:any) => {
   localStorage.setItem('userRole', res.role);
      localStorage.setItem('username', res.username);
      
      alert("Login Successful!");
      console.log("user",this.user)
      console.log("res",res)
      localStorage.setItem('userRole', res.role); 
    localStorage.setItem('userId', res.id);
      this.router.navigate(['/dashboard']);
  },
  error: (err) => {
    alert("Invalid Username or Password");
  }
});
}
}
