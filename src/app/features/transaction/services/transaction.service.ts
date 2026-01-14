import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { DatatableQueryParamsDto, TableCollectionResponse } from 'app/shared/services/models/table.model';
import { TransactionCollectionResponseDto } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = `${environment.apiUrl}/admin/report/transactions`;

  constructor(private http: HttpClient) {}

  getAll(params: DatatableQueryParamsDto, signal?: AbortSignal): Observable<TableCollectionResponse<TransactionCollectionResponseDto[]>> {
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
            recordsTotal: response.table.recordsTotal,
            recordsFiltered: response.table.recordsFiltered,
            length: response.table.length,
            page: response.table.page
          }
      })
      )
    );
  }

}
