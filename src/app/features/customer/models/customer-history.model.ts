export interface CustomerHistoryResponseDto {
  id: number;
  order_id: number;
  reason_id: number;
  created_at: string; // ISO 8601 format
  created_by_id: number;
  created_by: string;
  description: string;
  previous_data: string;
  new_data: string;
  user_created: string;
  user_id_created: number;
  user_updated: string | null;
  user_id_updated: number | null;
  reason: {
    id: number;
    reason: string;
  };
}
