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
    setTimeout(() => this.createChart(), 100);
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

printProduct(id: number) {
  this.http.get(`http://localhost:8080/api/products/print/${id}`, { 
    responseType: 'blob' 
  }).subscribe({
    next: (data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new tab
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.click();
    },
    error: (err) => alert("Error generating PDF")
  });
}



}

