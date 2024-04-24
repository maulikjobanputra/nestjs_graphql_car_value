export interface ResponseBody {
  statusCode: number;
  data: {
    success: boolean;
    message?: string;
    data?: ObjectType;
  };
}
export interface ObjectType {
  [key: string]: any;
}
