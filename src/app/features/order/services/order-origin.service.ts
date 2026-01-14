import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { OrderOriginResponseDto } from '../models/order-origin.model';

@Injectable({
  providedIn: 'root'
})
export class OrderOriginService {
  private baseUrl = `${environment.apiUrl}/admin/order-origins`;

  constructor(private http: HttpClient) {}

  getAll(signal?: AbortSignal): Observable<OrderOriginResponseDto[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => {  
        //console.log('ordenes', response);
        return response.data;
      })
    );
  }


}
