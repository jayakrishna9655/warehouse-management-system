import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router'; // Added ActivatedRoute
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-detail',
  imports: [CommonModule,RouterOutlet,FormsModule],
  templateUrl: './dashboard-detail.component.html',
  styleUrl: './dashboard-detail.component.css'
})
export class DashboardDetailComponent implements OnInit {
  newProduct: any = {
    sku: '',
    name: '',
    category: '',
    price: 0,
    quantity: 0
  };
  constructor(
    private http: HttpClient, 
    private router: Router, 
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    // Correct way to get ID: use this.route (ActivatedRoute)
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      console.log("Fetching product with ID:", id);
     this.http.get(`http://localhost:8080/api/products/${id}`)
        .subscribe({
          next: (res) => {
            this.newProduct = res;
          },
          error: (err) => console.error("Could not find product", err)
        });
    }
  }

saveProduct() {
    const user = localStorage.getItem('username');
    const token = localStorage.getItem('sessionToken');

    const url = this.newProduct.id 
      ? `http://localhost:8080/api/products/update/${this.newProduct.id}?username=${user}&sessionToken=${token}` 
      : `http://localhost:8080/api/products/create?username=${user}&sessionToken=${token}`;

    this.http.post(url, this.newProduct).subscribe({
      next: (res) => {
        alert("Product Saved Successfully!");
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if(err.status === 401) {
          alert("Session Expired! Please login again.");
          this.router.navigate(['/login']);
        } else {
          alert("Error saving product.");
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}