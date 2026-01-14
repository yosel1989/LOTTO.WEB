import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { ColumnsFilterDto, DatatableQueryParamsDto, PaginationResponse } from 'app/shared/services/models/table.model';
import { EmployeeCreated, LocalCreated, OrderChangeStatusRequestDto, OrderCollectionResponseDto, OrderDTO, UserCreated, OrderNotifyRequestDto, OrderCollectionToCharityResponseDto } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseAdminUrl = `${environment.apiUrl}/admin/orders`;
  private baseCharityUrl = `${environment.apiUrl}/charity/orders`;

  constructor(private http: HttpClient) {}

  getAll(columns: ColumnsFilterDto[], baseParams: DatatableQueryParamsDto, signal?: AbortSignal): Observable<PaginationResponse<OrderCollectionResponseDto>> {
    let httpParams = new HttpParams();

    Object.entries(baseParams).forEach(([key, value]) => {
      httpParams = httpParams.set(key, value.toString());
    });

    columns.forEach((col, i) => {
      httpParams = httpParams
        .set(`columns[${i}][data]`, col.data)
        .set(`columns[${i}][search][value]`, col.search.value)
        .set(`columns[${i}][search][regex]`, col.search.regex.toString())
        .set(`columns[${i}][search][match]`, col.search.match ?? '');
    });

    return this.http.get<any>(this.baseAdminUrl, { params: httpParams }).pipe(
      map(response => {  
        //console.log('ordenes', response);
        return {
            data : response.table.data,
            total : response.table.total,
            total_ticket : response.table.total_ticket,
            draw: response.table.draw,
            records_total: response.table.records_total,
            records_filtered: response.table.records_filtered,
            length: response.table.length,
            page: response.table.page
        }
      })
    );
  }


  exportAll(columns: ColumnsFilterDto[], baseParams: DatatableQueryParamsDto, signal?: AbortSignal): Observable<Blob> {
    let httpParams = new HttpParams();

    Object.entries(baseParams).forEach(([key, value]) => {
      httpParams = httpParams.set(key, value.toString());
    });

    columns.forEach((col, i) => {
      httpParams = httpParams
        .set(`columns[${i}][data]`, col.data)
        .set(`columns[${i}][search][value]`, col.search.value)
        .set(`columns[${i}][search][regex]`, col.search.regex.toString())
        .set(`columns[${i}][search][match]`, col.search.match ?? '');
    });

    return this.http.get(`${this.baseAdminUrl}/export`, {
      params: httpParams,
      responseType: 'blob'
    });

  }

  changeStatus(payload: OrderChangeStatusRequestDto): Observable<boolean> {
    return this.http.put<any>(this.baseAdminUrl +  `/${payload.uuid}/change-status`, payload ).pipe(
      map(response => response.data)
    );
  }

  getAllEmployeeCreated(): Observable<EmployeeCreated[]> {
    return this.http.get<any>(`${this.baseAdminUrl}/employees-created`,).pipe(
      map(response => {  
        return response.data
      })
    );
  }

  getAllUserCreated(): Observable<UserCreated[]> {
    return this.http.get<any>(`${this.baseAdminUrl}/users-created`,).pipe(
      map(response => {  
        return response.data
      })
    );
  }

  getAllLocalCreated(): Observable<LocalCreated[]> {
    return this.http.get<any>(`${this.baseAdminUrl}/locales-created`,).pipe(
      map(response => {  
        return response.data
      })
    );
  }

  getDetailByOrderId(orderId: number): Observable<OrderDTO> {
    return this.http.get<any>(`${this.baseAdminUrl}/${orderId}/detail`).pipe(
      map(response => {
        return response.data
      })
    );
  }

  notify(payload: OrderNotifyRequestDto): Observable<boolean> {
    return this.http.post<any>(`${this.baseAdminUrl}/notify`, payload).pipe(
      map(response => {
        return response.data
      })
    );
  }




  /***********************************************************************************
   * Charity
   */
  getAllToCharity(columns: ColumnsFilterDto[], baseParams: DatatableQueryParamsDto, signal?: AbortSignal): Observable<PaginationResponse<OrderCollectionToCharityResponseDto>> {
    let httpParams = new HttpParams();

    Object.entries(baseParams).forEach(([key, value]) => {
      httpParams = httpParams.set(key, value.toString());
    });

    columns.forEach((col, i) => {
      httpParams = httpParams
        .set(`columns[${i}][data]`, col.data)
        .set(`columns[${i}][search][value]`, col.search.value)
        .set(`columns[${i}][search][regex]`, col.search.regex.toString())
        .set(`columns[${i}][search][match]`, col.search.match ?? '');
    });

    return this.http.get<any>(this.baseCharityUrl, { params: httpParams }).pipe(
      map(response => {  
        //console.log('ordenes', response);
        return {
            data : response.table.data,
            total : response.table.total,
            total_ticket : response.table.total_ticket,
            draw: response.table.draw,
            records_total: response.table.records_total,
            records_filtered: response.table.records_filtered,
            length: response.table.length,
            page: response.table.page
        }
      })
    );
  }


  exportAllToCharity(columns: ColumnsFilterDto[], baseParams: DatatableQueryParamsDto, signal?: AbortSignal): Observable<Blob> {
    let httpParams = new HttpParams();

    Object.entries(baseParams).forEach(([key, value]) => {
      httpParams = httpParams.set(key, value.toString());
    });

    columns.forEach((col, i) => {
      httpParams = httpParams
        .set(`columns[${i}][data]`, col.data)
        .set(`columns[${i}][search][value]`, col.search.value)
        .set(`columns[${i}][search][regex]`, col.search.regex.toString())
        .set(`columns[${i}][search][match]`, col.search.match ?? '');
    });

    return this.http.get(`${this.baseCharityUrl}/export`, {
      params: httpParams,
      responseType: 'blob'
    });

  }

}
