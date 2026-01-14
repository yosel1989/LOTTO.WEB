export interface PaginationDto {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  length: number;
  page: number;
}


export interface TableCollectionResponse<T> {
  data: T;
  pagination: PaginationDto;
}


export interface DatatableQueryParamsDto{
  info: string;
	start: number;
	order: string;
	length: number;
	draw: number;
}

export interface QueryFilterDto{
  col: string;
  val: any;
}

export interface ColumnsFilterDto{
  data: string;
  search: {
    value: string;
    regex: boolean;
    match?: string;
  }
}

export interface PaginationResponse<T> {
  /** Datos que se mostrarán en la tabla. Puede ser una lista de registros o una estructura tabular */
  data: T[];

  /** Número de secuencia utilizado por el cliente para sincronizar solicitudes (por ejemplo, en DataTables) */
  draw: number;

  /** Número total de registros disponibles antes de aplicar filtros */
  records_total: number;

  /** Número total de registros después de aplicar filtros de búsqueda */
  records_filtered: number;

  /** Cantidad de registros por página solicitada */
  length: number;

  /** Número de página actual solicitada por el cliente */
  page: number;

  /** Suma total de ingresos */
  total: number;

  /** Suma total de tickets */
  total_ticket: number;
}
