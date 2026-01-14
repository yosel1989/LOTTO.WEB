export interface OrderCollectionResponseDto {
  /** Identificador único interno de la orden */
  id: number;

  /** Identificador global único (UUID) de la orden */
  uuid: string;

  /** Número secuencial o código de la orden */
  numero: number;

  /** Monto total de la orden */
  total: number;

  /** Total de tickets en la orden */
  total_tickets: number;

  /** Estado actual de la orden (por ejemplo: pendiente, pagada, cancelada) */
  status: string;

  /** Origen de la orden (por ejemplo: web, móvil, presencial) */
  origen: string;

  /** Nombre del empleado que registró la orden (si aplica) */
  created_by?: string;

  /** Usuario que registró la orden (si aplica) */
  created_by_user?: string;

  /** Local de creación de la orden */
  created_local?: string | null;

  /** Fecha de creación o registro de la orden */
  created_at: Date;

  /** Fecha de última modificación de la orden (si aplica) */
  updated_at?: Date;

  /** Nombre del empleado que modificó la orden (si aplica) */
  updated_by?: string;

  /** Usuario que modificó la orden (si aplica) */
  updated_by_user?: string;

  /** Nombre del local donde se que modificó la orden (si aplica) */
  updated_local?: string;

  /** Nombre completo del cliente asociado a la orden */
  customer: string;

  /** Número de documento de identidad del cliente */
  identity_document_number: string;

  /** Email del cliente */
  email: string | null;

  /** Prefijo telefónico del cliente */
  phone_prefix: string | null;

  /** Número telefónico del cliente */
  phone_number: string | null;

  /** Nombre del sorteo vinculado a la orden */
  lottery: string;


  payment_type: string | null;

  transaction: OrderCollectionTransactionResponseDto | null;
}


export interface OrderCollectionTransactionResponseDto{
  type: string;
  reference: string | null;
}



export interface OrderChangeStatusRequestDto {
  /** Identificador global único (UUID) de la orden */
  uuid: string;

  /** Nuevo estado de la orden */
  status: string;

  /** Descripción del motivo del cambio de estado */
  description: number;
}


export interface OrderNotifyRequestDto {
  /** Identificador privado único de la orden */
  id: number;

  /** Canal por donde se notificara */
  channel: string;

  /** Email por donde se notificara */
  email: string | null;

   /** Motivo por el cual se envió la notificación manual */
  description: string | null;

  /** Prefijo telefónico por donde se notificara por whatsapp*/
  phone_prefix: string | null;

  /** Número telefónico por donde se notificara por whatsapp*/
  phone_number: string | null
}


export interface OrderAdvancedFilterPayload{
  /** Fecha de creación inicial de la orden */
  created_at_start: string | null;

  /** Fecha de creación final de la orden */
  created_at_end: string | null;
  
  /** Estado de la orden */
  status: string | null;
}


export interface EmployeeCreated{
  /** Id del empleado */
  id: string | null;

  /** Nombre completo del empleado */
  full_name: string | null;
}


export interface UserCreated{
  /** Id del usuario */
  id: string | null;

  /** username del usuario */
  username: string | null;
}


export interface LocalCreated{
  /** Id del empleado */
  id: string | null;

  /** Nombre completo del empleado */
  name: string | null;
}





/**************************************************************************************
 * Admin
 */

export interface LotteryTicketDTO {
  id: number;
  uuid: string;
  idSorteo: number;
  numero: number;
  precio: number;
  status: string;
  idOrden: number | null;
  createdById: number;
  createdBy: any;
  createdAt: string;
  updatedById: number | null;
  updatedBy: any;
  updatedAt: string | null;
  lottery: any;
}

export interface DetailDTO {
  id: number;
  uuid: string;
  idOrden: number;
  number: number;
  idSorteoRifa: number;
  precio: number;
  createdById: number | null;
  createdBy: any;
  createdAt: string;
  updatedById: number | null;
  updatedBy: any;
  updatedAt: string | null;
  lotteryTicket: LotteryTicketDTO;
}

export interface OrderDTO {
  id: number;
  uuid: string;
  numero: number;
  customer_id: number;
  id_sorteo: number;
  total: number;
  estado: string;
  origen: string;
  codigo_vendedor: string | null;
  id_emp_registro: number | null;
  emp_registro: any;
  f_registro: string;
  id_emp_modifico: number | null;
  emp_modifico: any;
  f_modifico: string;
  customer: any;
  lottery: any;
  detail: DetailDTO[];
}




/****************************************************************************************
 * Charity
 */
export interface OrderCollectionToCharityResponseDto {

  /** Monto total de la orden */
  total: number;

  /** Total de tickets en la orden */
  total_tickets: number;

  /** Estado actual de la orden (por ejemplo: pendiente, pagada, cancelada) */
  status: string;

  /** Fecha de creación o registro de la orden */
  created_at: Date;

}
