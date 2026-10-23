export type LeadStatus = "new" | "contacted" | "converted" | "lost";

export interface LeadRow {
  id: string;
  conversation_id: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  interest: string | null;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_messages: number;
  products_shown: number;
  est_value: number;
  handoff_requested: boolean;
  intent_score: number;
}