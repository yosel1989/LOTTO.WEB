import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { SettingsVariableDto, SettingsVariableRequestDto } from '../models/settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsVariableService {
  private baseUrl = `${environment.apiUrl}/admin/settings-variables`;

  constructor(private http: HttpClient) {}

  create(payload: SettingsVariableRequestDto): Observable<SettingsVariableDto> {
    return this.http.post<any>(this.baseUrl, payload ).pipe(
      map(response => response.data)
    );
  }

  getAll(): Observable<SettingsVariableDto[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(response => response.data)
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  getById(id: number): Observable<SettingsVariableDto> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }
}
