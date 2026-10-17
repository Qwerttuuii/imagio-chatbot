export type Role = "user" | "assistant";

export interface ProductVariant {
  label: string;
  price: number;
  size_cm?: string;
}

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | null;
  from: boolean; // true when the product has several sizes/prices
  variants: ProductVariant[];
  image_url: string | null;
  product_url: string | null;
  reason: string;
}

export type Block =
  | { type: "text"; text: string }
  | { type: "products"; items: ProductCardData[] };

export interface ChatMessage {
  id: string;
  role: Role;
  blocks: Block[];
}

export type Status = "ready" | "thinking" | "offline";