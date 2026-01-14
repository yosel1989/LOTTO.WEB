export interface SorteoDto {
  uuid: string;
  nombre: string;
  slug: string;
  descripcion: string;
  f_inicio_venta: string;
  f_fin_venta: string;
  f_sorteo: string;
  f_ext_sorteo: string;
  precio_rifa: number;
  numero_min: number;
  numero_max: number;
  flag_rifas: boolean;
  estado: string;
  id_emp_registro: number;
  emp_registro: string;
  f_registro: string;
  id_emp_modifico: number;
  emp_modifico: string;
  f_modifico: string;
  cant_rifas: number;
}





export interface SorteoPayloadDto {
  nombre: string;
  descripcion: string;
  f_inicio_venta: string;   // formato ISO 8601
  f_fin_venta: string;
  f_sorteo: string;
  f_ext_sorteo: string | null;
  precio_rifa: number;
  numero_min: number;
  numero_max: number;
  flag_rifas: boolean;
}

export interface SorteoUpdatePayloadDto {
  uuid: string;
  nombre: string;
  descripcion: string;
  f_inicio_venta: string;   // formato ISO 8601
  f_fin_venta: string;
  f_sorteo: string;
  f_ext_sorteo: string | null;
  precio_rifa: number;
  numero_min: number;
  numero_max: number;
  flag_rifas: boolean;
}



export interface SorteoCreateResponseDto {
  uuid: string;
  nombre: string;
  slug: string;
  descripcion: string;
  f_inicio_venta: string;
  f_fin_venta: string;
  f_sorteo: string;
  f_ext_sorteo: string;
  precio_rifa: number;
  numero_min: number;
  numero_max: number;
  flag_rifas: boolean;
  estado: string;
  id_emp_registro: number;
  emp_registro: string;
  f_registro: string;
  id_emp_modifico: number;
  emp_modifico: string;
  f_modifico: string;
  cant_rifas: number;
}



export interface SorteoCollectionResponseDto {
  id: number;
  uuid: string;
  nombre: string;
  slug: string;
  descripcion: string;
  f_inicio_venta: Date;
  f_fin_venta: Date;
  f_sorteo: Date;
  f_ext_sorteo: Date | null;
  precio_rifa: number;
  numero_min: number;
  numero_max: number;
  flag_rifas: boolean;
  estado: string;
  id_emp_registro: number;
  emp_registro: string;
  f_registro: Date;
  id_emp_modifico: number;
  emp_modifico: string;
  f_modifico: Date | null;
  cant_rifas: number;
}






export interface SorteoFindByIdResponseDto {
  id: number;
  uuid: string;
  nombre: string;
  slug: string;
  descripcion: string;
  f_inicio_venta: string;
  f_fin_venta: string;
  f_sorteo: string;
  f_ext_sorteo?: string;
  precio_rifa: number;
  numero_min: number;
  numero_max: number;
  flag_rifas: boolean;
  estado: string;
  id_emp_registro: number;
  emp_registro: string;
  f_registro: string;
  id_emp_modifico?: number;
  emp_modifico?: string;
  f_modifico?: string;
}




export interface SorteoCollectionQueryParamsDto{
  info: string;
	start: number;
	order: string;
	length: number;
	draw: number;
}



export interface SorteoChangeStatusPayloadDto{
  descripcion: string | null;
  uuid: string;
	estado: string;
}
