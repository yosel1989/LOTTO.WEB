export interface DashboardCountsResponseDto {
  wallet_top_ups: number;                       
  wallet_with_drawals: number;                  
  customer_sessions_success: number;            
  sessions_success: number;                     
  new_customers: number;                        
  customer_balance: number;                     
  profile: number;                              
  customer_wallet_top_ups: number;              
  customer_wallet_with_drawals: number;
  bono_balance: number;
  increase: number;                             
  decrease: number;                             
}


export interface DashboardTotalCountsResponseDto {
  total_balance: number;                       
  total_tickets: number;                       
  new_customers: number;                                              
  total_success_orders: number;                                              
  total_locales: number;
  total_comision: number;                                          
}


export interface DashboardCountsRequestDto{
  date_start: string;
  date_end: string;
}


export interface DashboardTotalSalesMonthResponseDto {
  month: string;
  total_sales: number;
  total_tickets: number;
}



export interface DashboardTotalSalesDayByMonthResponseDto {
  day: string;
  total_sales: number;
  total_tickets: number;
}


export interface DashboardTop10SalesResponseDto {
  local_id: string | null;
  local_name: string | null;
  total_sales: number;
  total_tickets: number;
}

export interface DashboardTotalSalesGroupByOriginResponseDto {
  origin: string | null;
  total_sales: number;
}

export interface DashboardTotalSalesGroupByPaymentTypeResponseDto {
  type: string | null;
  total_sales: number;
}



export interface DashboardDateRangeRequestDto{
  date_start: string;
  date_end: string;
}