import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-dashboard',
   imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
products: any[] = [];
  selectedProduct: any = null; // Holds the product for the "View" popup
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get("http://localhost:8080/api/products").subscribe(res => {
      this.products = res as any[];
    });
  }

  viewDetails(product: any) {
    this.selectedProduct = product; // This triggers the popup
  }

  openCreateModal() {
    // Logic to open a create form (similar to View)
  }
}
