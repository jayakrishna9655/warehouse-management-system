import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sign',
  imports: [FormsModule,RouterOutlet,RouterLink],
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.css'
})
export class SignComponent {
name:any;
email:any
Password:any
constructor(private http: HttpClient) {}
getdata(){
  var payload={
    username:this.name,
   password:this.Password
  }
  console.log("payload",payload)
 let url = "http://localhost:8080/api/users/register";
    
    this.http.post(url, payload).subscribe({
      next: (res) => {
        alert("Registration Successful!");
        console.log("Response:", res);
      },
      error: (err) => {
        alert("Registration Failed!");
        console.error("Error:", err);
      }
    });
}

}
