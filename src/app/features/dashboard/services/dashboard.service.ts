import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { DashboardCountsRequestDto, DashboardCountsResponseDto, DashboardDateRangeRequestDto, DashboardTop10SalesResponseDto, DashboardTotalCountsResponseDto, DashboardTotalSalesDayByMonthResponseDto, DashboardTotalSalesGroupByOriginResponseDto, DashboardTotalSalesGroupByPaymentTypeResponseDto, DashboardTotalSalesMonthResponseDto } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getCounts(params: DashboardCountsRequestDto): Observable<DashboardTotalCountsResponseDto> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.baseUrl}/counts`, { params: httpParams }).pipe(
      map(response => response.data)
    );
  
  }

  getTotalCounts(params: DashboardDateRangeRequestDto): Observable<DashboardTotalCountsResponseDto> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.baseUrl}/total-counts`, { params: httpParams }).pipe(
      map(response => response.data)
    );
  
  }

  getTotalSalesMonth(): Observable<DashboardTotalSalesMonthResponseDto[]> {


    return this.http.get<any>(`${this.baseUrl}/total-sales-month`).pipe(
      map(response => response.data)
    );
  }

  getTotalSalesDayByMonth(year: number, month: number): Observable<DashboardTotalSalesDayByMonthResponseDto[]> {

  
    return this.http.get<any>(`${this.baseUrl}/total-sales-day-by-month/${year}/${month}`).pipe(
      map(response => response.data)
    );
  }


  getTop10Sales(params: DashboardDateRangeRequestDto): Observable<DashboardTop10SalesResponseDto[]> {

    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.baseUrl}/top-10-sales`, { params: httpParams }).pipe(
      map(response => response.data)
    );
  }

  getTotalSalesGroupByOrigin(params: DashboardDateRangeRequestDto): Observable<DashboardTotalSalesGroupByOriginResponseDto[]> {

    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.baseUrl}/total-sales-origin`, { params: httpParams }).pipe(
      map(response => response.data)
    );
  }

  getTotalSalesGroupByPaymentType(params: DashboardDateRangeRequestDto): Observable<DashboardTotalSalesGroupByPaymentTypeResponseDto[]> {

    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(`${this.baseUrl}/total-sales-payment-type`, { params: httpParams }).pipe(
      map(response => response.data)
    );
  }

}
