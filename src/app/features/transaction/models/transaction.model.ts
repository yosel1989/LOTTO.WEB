



export interface TransactionCollectionResponseDto{
    id: number;
    id_customer: number;
    currency: string;
    amount: string;
    type: TransactionType;
    first_name_customer: string;
    last_name_customer: string;
    user_name: string;
    created_at: Date;
    origin: string;
}



export interface TransactionFilterPayload {
    //id: string | null;
    play_id: number | null;
    customer_id: number | null;
    type: string | null;
    email: string | null;
    first_name_customer: string | null;
    last_name_customer: string | null;
    user_name: string | null;
    created_at: string | null;
    origin: string | null;
}


export type TransactionType =
  | 'top_up'           // Recarga de saldo
  | 'ticket_purchase'  // Compra de boleto
  | 'withdrawal'       // Retiro de saldo
  | 'prize_claim'      // Cobro de premio
  | 'bonus_credit'     // Crédito por promoción o bono
  | 'refund'           // Reembolso por error o anulación
  | 'adjustment';      // Ajuste manual por parte del operador