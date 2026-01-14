import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { OrderHistoryResponseDto } from '../models/order-history.model';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private baseUrl = `${environment.apiUrl}/admin/order-history`;

  constructor(private http: HttpClient) {}

  getAllByOrder(orderUuid: string, signal?: AbortSignal): Observable<OrderHistoryResponseDto[]> {
    return this.http.get<any>(`${this.baseUrl}/${orderUuid}`).pipe(
      map(response => {
        return response.data;
      })
    );
  }


}
