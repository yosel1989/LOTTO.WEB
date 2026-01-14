export interface SettingsVariableDto {
  /** Identificador interno autoincremental */
  id: number;

  /** Código único y estable del ajuste (ej: MAX_USERS, ENABLE_SSL) */
  code: string;

  /** Nombre descriptivo del ajuste */
  name: string;

  /** Valor asignado al ajuste */
  value: string;

  /** Tipo de dato del valor (ej: integer, boolean, string) */
  type: string;

  /** Descripción opcional del ajuste */
  description?: string;

  /** Fecha y hora de su registro */
  created_at: string;

  /** Nombre del usuario que registró */
  user_created: string;

  /** Id del usuario que registró */
  user_id_created: number;

  /** Nombre del personal que registró */
  created_by: string;

  /** Fecha y hora de la última actualización */
  updated_at?: string;

  /** Nombre del personal que realizó la última modificación */
  updated_by?: string;

  /** Nombre del usuario que realizó la última modificación */
  user_updated?: string;

  /** Id del usuario que realizó la última modificación */
  user_id_updated?: number;

  /** Indica si el ajuste está activo o no */
  active: boolean;
}


export interface SettingsVariableRequestDto{
    name: string;
    code: string;
    type: string;
    value: string;
}
