export interface CustomerDto {
  id: number;
  uuid: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  num_documento: string;
  pref_telefono: string;
  telefono: string;
  provincia: string;
  id_emp_registro: number | null;
  emp_registro: string | null;
  f_registro: string; // ISO 8601
  id_emp_modifico: number | null;
  emp_modifico: string | null;
  fechaModifico: string | null; // ISO 8601 o null
}






export interface CustomerPayloadDto {
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

export interface CustomerUpdatePayloadDto {
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



export interface CustomerCreateResponseDto {
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



export interface CustomerCollectionResponseDto {
  id: number;
  uuid: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  num_documento: string;
  pref_telefono: string;
  telefono: string;
  provincia: string;
  id_emp_registro: number | null;
  emp_registro: string | null;
  f_registro: string;
  id_emp_modifico: number | null;
  emp_modifico: string | null;
  fechaModifico: string | null;
}






export interface CustomerFindByIdResponseDto {
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




export interface CustomerCollectionQueryParamsDto{
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





export interface CustomerInfoByUuidToAdminResponseDto {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  identity_document_type_id: number;
  identity_document_type: string;
  identity_document_number: string;
  prefix_phone: string;
  phone: string;
  department?: string;
  province?: string;
  district?: string;
  employee_id_created?: number;
  employee_created?: string;
  created_at: string; // ISO date string
  employee_id_updated?: number;
  employee_updated?: string;
  updated_at?: string; // ISO date string
  gender_id?: number;
  gender?: string;
  date_birth?: string; // ISO date string
  location_code?: string;
}




export interface CustomerFilterPayload {
    created_at: string | null;
    user_name: string | null;
    id_customer: number | null;
    id_department: string | null;
    id_province: string | null;
    id_district: string | null;
    last_login_date: string | null;
    verified_at: string | null;
    first_name: string | null;
    last_name: string | null;
    id_gender: number | null;
    email: string | null;
    birth_date: string | null;
}



export interface CustomerChangeEmailRequestDto {
  /** Identificador privado único del cliente */
  id: number;

  /** Correo electrónico por el cual será cambiado */
  email: string | null;

   /** Motivo por el cual se edito el correo electrónico */
  description: string | null;

}

export interface CustomerChangePhoneRequestDto {
  /** Identificador privado único del cliente */
  id: number;

  /** Prefijo del teléfono */
  phone_prefix: string | null;

  /** Número del teléfono */
  phone_number: string | null;

   /** Motivo por el cual se edito el correo electrónico */
  description: string | null;

}

