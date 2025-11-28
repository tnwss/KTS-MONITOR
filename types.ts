export enum ViewState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  REMOTE_CONTROL = 'REMOTE_CONTROL',
  PARAMETER_SETTING = 'PARAMETER_SETTING',
  MAINTENANCE_RECORD = 'MAINTENANCE_RECORD',
  REPAIR_RECORD = 'REPAIR_RECORD',
  ALARM_HISTORY = 'ALARM_HISTORY',
  TODO_LIST = 'TODO_LIST',
  HELP = 'HELP',
}

export interface Alarm {
  code: string;
  message: string;
  type: 'ALARM' | 'WARNING';
  timestamp: string;
  active: boolean;
}

export interface EquipmentData {
  oilTemp: number;
  windSpeed: number;
  liftingWeight: number;
  speed: number;
  mainAngle: number;
  ropeLength: number;
  workRadius: number;
  model: string;
  status: 'Running' | 'Idle' | 'Error';
  // New fields for advanced control
  slewAngle: number;
  knuckleAngle: number;
}

export interface SystemParameters {
  liftingWeightLimit: number;
  warning90: number;
  alarm110: number;
}

export interface MaintenanceEntry {
  id: string;
  type: 'Maintenance' | 'Repair';
  component: string;
  date: string;
  time: string;
  partName: string;
  description: string;
  employee: string;
}