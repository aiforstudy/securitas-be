export interface ApiResponse<T> {
  data: T;
  metadata: {
    timestamp: string;
    path: string;
    statusCode: number;
    message?: string;
  };
}
