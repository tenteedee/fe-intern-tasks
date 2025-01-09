export interface Service {
  key: number;
  service_name: string;
  duration: number;
  price_type: 'FIXED' | 'VARIES';
  fixed_price?: number;
  from_price?: number;
  to_price?: number;
}
