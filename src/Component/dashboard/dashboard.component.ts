import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  products: any[] = [];
  selectedProduct: any = null;
  searchTerm: string = '';
  isAdmin: boolean = false;
  constructor(private http: HttpClient, private router: Router) { }
  @ViewChild('categoryChart') categoryChartCanvas!: ElementRef;
  chart: any;
ngOnInit() {
  this.loadProducts();
  const role = localStorage.getItem('userRole');
  this.isAdmin = (role === 'ADMIN');
  
  // Check session every 1 minute
  setInterval(() => {
    this.checkSessionTimeout();
  }, 60000); 
}
checkSessionTimeout() {
  const loginTime = Number(localStorage.getItem('login_time'));
  const currentTime = new Date().getTime();
  const thirtyMinutes = 30 * 60 * 1000;

  if (currentTime - loginTime > thirtyMinutes) {
    this.logout(); // Call your logout function
  }
}
logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
  // Optional: Call a backend logout API to set sessionToken to null
}
loadProducts() {
  this.http.get("http://localhost:8080/api/products").subscribe({
    next: (res) => {
      this.products = res as any[];
      // Trigger chart creation ONLY after products are loaded
      this.createChart(); 
    },
    error: (err) => {
      // If the backend returns 401 (Expired), the Interceptor will handle it,
      // but we handle other errors here.
      console.error("Error loading products", err);
    }
  });
}
// Add this inside your DashboardComponent class
get filteredProducts() {
  if (!this.searchTerm) return this.products;
  return this.products.filter(p => 
    p.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
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
  createChart() {
    const categoryMap = this.products.reduce((acc: any, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(categoryMap);
    const data = Object.values(categoryMap);

    if (this.chart) this.chart.destroy(); // Destroy old chart if it exists

    this.chart = new Chart(this.categoryChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // This allows us to control height via CSS
        plugins: {
          legend: {
            position: 'right', // Moves labels to the side to save vertical space
          }
        }
      }
    });
  }

  // Inside dashboard.component.ts

  get totalValue(): number {
    return this.products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  }

  get lowStockCount(): number {
    return this.products.filter(p => p.quantity < 5 && p.quantity > 0).length;
  }

  get outOfStockCount(): number {
    return this.products.filter(p => p.quantity === 0).length;
  }
}

