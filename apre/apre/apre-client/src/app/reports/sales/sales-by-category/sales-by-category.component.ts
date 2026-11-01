import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartComponent } from '../../../shared/chart/chart.component';
import { environment } from '../../../../environments/environment';

interface SalesCategory {
  category: string;
  totalSales: number;
}

@Component({
  selector: 'app-sales-by-category',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  template: `
    <div>
      <h1>Sales by Category</h1>

      <p *ngIf="errorMessage">{{ errorMessage }}</p>

      <div *ngIf="showChart" class="chart-container">
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Sales by Category'"
            [data]="salesData"
            [labels]="categories">
          </app-chart>
        </div>
      </div>
    </div>
  `,
  styles: `
    .chart-container {
      width: 50%;
      margin: 0 auto;
    }

    .chart-card {
      width: 100%;
      margin: 20px 0;
    }
  `
})
export class SalesByCategoryComponent implements OnInit {
  categories: string[] = [];
  salesData: number[] = [];
  showChart = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchSalesByCategory();
  }

  fetchSalesByCategory(): void {
    this.http.get<SalesCategory[]>(
      `${environment.apiBaseUrl}/reports/sales/categories`
    ).subscribe({
      next: data => {
        this.categories = data.map(item => item.category);
        this.salesData = data.map(item => item.totalSales);
        this.showChart = data.length > 0;
        this.errorMessage = data.length ? '' : 'No sales data found.';
      },
      error: () => {
        this.errorMessage = 'Error fetching sales data.';
        this.showChart = false;
      }
    });
  }
}