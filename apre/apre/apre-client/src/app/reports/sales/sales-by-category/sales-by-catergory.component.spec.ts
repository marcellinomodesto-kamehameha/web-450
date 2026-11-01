import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import { SalesByCategoryComponent } from './sales-by-category.component';
import { environment } from '../../../../environments/environment';

describe('SalesByCategoryComponent', () => {
  let component: SalesByCategoryComponent;
  let fixture: ComponentFixture<SalesByCategoryComponent>;
  let httpMock: HttpTestingController;

  const apiUrl =
    `${environment.apiBaseUrl}/reports/sales/categories`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByCategoryComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesByCategoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();

    httpMock.expectOne(apiUrl).flush([]);
  });

  it('should fetch and display sales data by category', () => {
    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('GET');

    request.flush([
      { category: 'Electronics', totalSales: 2500 },
      { category: 'Furniture', totalSales: 1800 }
    ]);

    expect(component.categories).toEqual([
      'Electronics',
      'Furniture'
    ]);

    expect(component.salesData).toEqual([2500, 1800]);
    expect(component.showChart).toBeTrue();
  });

  it('should display a message when no sales data is found', () => {
    httpMock.expectOne(apiUrl).flush([]);

    expect(component.showChart).toBeFalse();
    expect(component.errorMessage).toBe('No sales data found.');
  });
});