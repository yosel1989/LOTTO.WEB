import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { TransactionPaymentTypeResponseDto } from '../models/transaction-payment-type.model';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionPaymentTypeService {
  private baseUrl = `${environment.apiUrl}/admin/transaction-payment-types`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TransactionPaymentTypeResponseDto[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(response => response.data)
    );
  }

}
