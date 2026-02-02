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
isAdmin: boolean = false;
  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit() {
    this.loadProducts();
    const role = localStorage.getItem('userRole'); 
  this.isAdmin = (role === 'ADMIN');
  }

  loadProducts() {
    this.http.get("http://localhost:8080/api/products").subscribe(res => {
      this.products = res as any[];
    });
  }
// Inside DashboardComponent class

// 1. Calculate Total Value
get totalValue() {
  return this.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
}

// 2. Count Low Stock Items
get lowStockCount() {
  return this.products.filter(p => p.quantity < 10 && p.quantity > 0).length;
}

// 3. Count Out of Stock
get outOfStockCount() {
  return this.products.filter(p => p.quantity === 0).length;
}
  viewDetails(product: any) {
    this.router.navigate(['/dashboard-detail', product.id]);
  }

  openCreateModal() {
    this.router.navigate(['/dashboard-detail']);
  }

deleteProduct(id: any) {
  if (confirm("Are you sure you want to remove this product from the warehouse?")) {
    const role = localStorage.getItem('userRole');
    this.http.delete(`http://localhost:8080/api/products/${id}?role=${role}`).subscribe({
      next: () => {
        alert("Product deleted successfully!");
      },
      error: (err) => {
        console.error(err);
        alert(err.error || "Failed to delete product. Only Admins have permission.");
      }
    });
  }
}
  }

