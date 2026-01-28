import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
   imports: [FormsModule,CommonModule,RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
products: any[] = [];
  selectedProduct: any = null; 
  searchTerm: string = '';

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get("http://localhost:8080/api/products").subscribe(res => {
      this.products = res as any[];
    });
  }

  viewDetails(product: any) {
    this.router.navigate(['/dashboard-detail', product.id]);
  }

  openCreateModal() {
    this.router.navigate(['/dashboard-detail']);
  }
}
