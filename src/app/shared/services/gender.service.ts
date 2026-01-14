import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { GenderDto } from '../models/gender.model';

@Injectable({
  providedIn: 'root'
})
export class GenderService {
  private baseUrl = `${environment.apiUrl}/generos`;

  constructor(private http: HttpClient) {}

  getAll(signal?: AbortSignal): Observable<GenderDto[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(response => response.data.map((item: any) => ({
        id: item.id,
        name: item.nombre,
      })))
    );
  }

}
