import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from 'environments/environment';
import { DepartmentDto, DistrictDto, ProvinceDto } from '../models/ubigeo.model';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  private baseUrl = `${environment.apiUrl}/ubigeo`;

  constructor(private http: HttpClient) {}

  getDepartamentsAll(signal?: AbortSignal): Observable<DepartmentDto[]> {
    return this.http.get<any>(`${this.baseUrl}/departamentos`).pipe(
      map(response => response.data.map((item: any) => ({
        name: item.nombre,
        code: item.codigo,
      })))
    );
  }

  getAllProvinceByDepartment(code_department: string | null): Observable<ProvinceDto[]> {

    return !code_department ? of([]) : this.http.get<any>(`${this.baseUrl}/departamentos/${code_department}/provincias`).pipe(
      map(response => response.data.map((item: any) => ({
        name: item.nombre,
        code: item.codigo,
      })))
    );
  }

  getAllDistrictsByProvince(code_province: string): Observable<DistrictDto[]> {
    return this.http.get<any>(`${this.baseUrl}/provincias/${code_province}/distritos`).pipe(
      map(response => response.data.map((item: any) => ({
        name: item.nombre,
        code: item.codigo,
      })))
    );
  }

}
