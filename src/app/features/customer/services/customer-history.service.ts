import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { CustomerHistoryResponseDto } from '../models/customer-history.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerHistoryService {
  private baseUrl = `${environment.apiUrl}/admin/customer-history`;

  constructor(private http: HttpClient) {}

  getAllByCustomer(customerUuid: string, signal?: AbortSignal): Observable<CustomerHistoryResponseDto[]> {
    return this.http.get<any>(`${this.baseUrl}/${customerUuid}`).pipe(
      map(response => {
        return response.data;
      })
    );
  }


}
