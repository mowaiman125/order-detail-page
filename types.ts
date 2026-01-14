
export interface ProductSpec {
  label: string;
  value: string;
}

export interface Accessory {
  name: string;
  included: boolean;
  note?: string;
  count?: number;
}

export interface Seller {
  name: string;
  location: string;
  rating: number;
  itemsSold: number;
  avatar: string;
  verified: boolean;
}

export interface PricePoint {
  date: string;
  price: number;
}

// New Types for State Management
export type UserRole = 'buyer' | 'seller';
export type ListingStatus = 'active' | 'sold' | 'reserved';

// Order Transaction Statuses (Mapped to the provided table)
export type TransactionStatus = 
  | 'draft_offer'         // [NEW] 買家填寫出價單
  | 'offer_submitted'     // 01A 出價中(已出價)
  | 'offer_countered'     // 01B 出價中(已還價)
  | 'payment_pending'     // 02 待付款
  | 'to_ship'             // 03A 待發貨
  | 'in_transit'          // 03B 運送中
  | 'warehouse_received'  // 04 已入庫
  | 'authenticating'      // 05 驗證中
  | 'auth_passed'         // 06 驗證通過
  | 'auth_passed_dispute' // 06A 驗證通過 (異議)
  | 'auth_failed'         // 07 驗證不通過
  | 'handover_wm'         // 08A 待交收(WM點)
  | 'handover_self'       // 08B 待交收(自行交收)
  | 'handover_seller_retrieved' // 08C 待交收(賣家已取貨)
  | 'completed'           // 09 交易完成
  | 'cancelled'           // 10 交易取消
  | 'refunded';           // 11 已退款
