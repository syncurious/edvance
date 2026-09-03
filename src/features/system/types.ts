export interface SystemSummary {
  productName: string;
  statusLabel: string;
  routeAreas: number;
}

export interface SystemService {
  getSummary(): Promise<SystemSummary>;
}
