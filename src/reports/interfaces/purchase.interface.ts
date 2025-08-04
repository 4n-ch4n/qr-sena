export interface IPurchase {
  id: string;
  user_id: string;
  total_price: string;
  status: string;
  payment_id: string;
  created_at: Date;
  items: Item[];
  shippingInfo: ShippingInfo;
}

export interface Item {
  name_to_engrave: string;
  type: string;
  unit_price: number;
}

export interface ShippingInfo {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  status: string;
  carrier: null | string;
  tracking_code: null | string;
}
