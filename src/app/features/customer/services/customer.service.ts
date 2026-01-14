import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { TableCollectionResponse } from 'app/shared/services/models/table.model';
import { CustomerChangeEmailRequestDto, CustomerChangePhoneRequestDto, CustomerCollectionQueryParamsDto, CustomerCollectionResponseDto, CustomerDto, CustomerInfoByUuidToAdminResponseDto } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = `${environment.apiUrl}/admin/customers`;

  constructor(private http: HttpClient) {}

  getAll(params: CustomerCollectionQueryParamsDto, signal?: AbortSignal): Observable<TableCollectionResponse<CustomerCollectionResponseDto[]>> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<any>(this.baseUrl, { params: httpParams }).pipe(
      map(response => ({
          data : response.table.data,
          pagination: {
            draw: response.table.draw,
            recordsTotal: response.table.records_total,
            recordsFiltered: response.table.records_filtered,
            length: response.table.length,
            page: response.table.page
          }
      })
      )
    );
  }


  getInfo(uuid: string, signal?: AbortSignal): Observable<CustomerInfoByUuidToAdminResponseDto> {

    return this.http.get<any>(`${this.baseUrl}/${uuid}`).pipe(
      map(response => response.data)
    );
  }


  changeEmail(payload: CustomerChangeEmailRequestDto): Observable<boolean> {
    return this.http.put<any>(`${this.baseUrl}/change-email`, payload).pipe(
      map(response => {
        return response.data
      })
    );
  }

  changePhone(payload: CustomerChangePhoneRequestDto): Observable<boolean> {
    return this.http.put<any>(`${this.baseUrl}/change-phone`, payload).pipe(
      map(response => {
        return response.data
      })
    );
  }

}
