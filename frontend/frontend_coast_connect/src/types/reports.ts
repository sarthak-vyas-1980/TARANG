import type { User } from './user';

export type HazardType = 
  | 'TSUNAMI' 
  | 'STORM_SURGE' 
  | 'HIGH_WAVES' 
  | 'COASTAL_FLOODING' 
  | 'ABNORMAL_TIDE';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';

export type Status = 'PENDING' | 'VERIFIED' | 'INVESTIGATING' | 'REJECTED';

export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
  reportsCount?: number;
}

export interface Report {
  id: number;
  type: HazardType;
  description: string;
  severity: Severity;
  status: Status;
  reporterId: number;
  locationId?: number;
  createdAt: string;
  updatedAt: string;
  reporter?: Pick<User, 'id' | 'name' | 'email'>;
  location?: Location;
}

export interface CreateReportData {
  type: HazardType;
  description: string;
  severity: Severity;
  locationName: string;
  lat: number;
  lng: number;
}

export interface UpdateReportData {
  type?: HazardType;
  description?: string;
  severity?: Severity;
  locationName?: string;
  lat?: number;
  lng?: number;
}

export interface UpdateReportStatusData {
  status: Status;
}

export interface ReportFilters {
  type?: HazardType;
  severity?: Severity;
  status?: Status;
  search?: string;
  reporterId?: number;
  locationId?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CreateLocationRequest {
  name: string;
  lat: number;
  lng: number;
}

export interface LocationResponse extends Location {}

