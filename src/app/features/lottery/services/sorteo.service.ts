import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SorteoChangeStatusPayloadDto, SorteoCollectionQueryParamsDto, SorteoCollectionResponseDto, SorteoDto, SorteoFindByIdResponseDto, SorteoPayloadDto } from '../models/sorteo.model';
import { environment } from 'environments/environment';
import { TableCollectionResponse } from 'app/shared/services/models/table.model';

@Injectable({
  providedIn: 'root'
})
export class SorteoService {
  private baseUrl = `${environment.apiUrl}/admin/sorteos`;

  constructor(private http: HttpClient) {}

  /*// Obtener un sorteo por UUID
  getSorteo(uuid: string): Observable<SorteoDto> {
    return this.http.get<SorteoDto>(`${this.baseUrl}/${uuid}`);
  }

  // Obtener todos los sorteos
  getSorteos(): Observable<SorteoDto[]> {
    return this.http.get<SorteoDto[]>(this.baseUrl);
  }*/

  // Crear un nuevo sorteo
  createSorteo(payload: SorteoPayloadDto): Observable<SorteoDto> {
    return this.http.post<{ data: SorteoDto }>(this.baseUrl, payload).pipe(
      map(response => response.data)
    );
  }

  collectionSorteo(params: SorteoCollectionQueryParamsDto, signal?: AbortSignal): Observable<TableCollectionResponse<SorteoCollectionResponseDto[]>> {
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

  findSorteo(id: number): Observable<SorteoFindByIdResponseDto> {
    return this.http.get<any>(this.baseUrl + "/" + id).pipe(
      map(response => response.data)
    );
  }

  changeStatus(payload: SorteoChangeStatusPayloadDto): Observable<boolean> {
    return this.http.put<any>(this.baseUrl + "/cambiar-estado", payload ).pipe(
      map(response => response.data)
    );
  }

}
