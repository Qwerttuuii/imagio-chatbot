export type HandoffStatus = "pending" | "contacted" | "closed";

export interface ConversationRow {
  id: string;
  session_id: string;
  entry_path: string | null;
  status: string;
  created_at: string;
  admin_seen_at: string | null;
  last_activity: string;
  last_message: string | null;
  last_role: string | null;
  first_message: string | null;
  message_count: number;
  user_messages: number;
  unread_count: number;
  lead_id: string | null;
  lead_name: string | null;
  lead_phone: string | null;
  lead_email: string | null;
  handoff_id: string | null;
  handoff_status: HandoffStatus | null;
  handoff_reason: string | null;
  handoff_at: string | null;
}

export interface ThreadMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  product_ids: string[];
  created_at: string;
}

export interface HandoffRow {
  id: string;
  conversation_id: string;
  reason: string | null;
  status: HandoffStatus;
  created_at: string;
  handled_at: string | null;
  lead_name: string | null;
  lead_phone: string | null;
  lead_email: string | null;
  lead_interest: string | null;
  last_message: string | null;
  first_message: string | null;
  user_messages: number;
}

export interface KnowledgeRow {
  id: string;
  topic: string;
  question: string;
  answer: string;
  source: "manual" | "from_unanswered" | "faq_import";
  active: boolean;
  variants: string[];
  instant: boolean;
  product: string | null;
  has_prices: boolean;
  review_note: string | null;
  created_at: string;
  updated_at: string;
}

/** The name shown for a customer: the name they gave, or "Visitor" plus a short code. */
export const visitorName = (name: string | null | undefined, id: string) => name?.trim() || `Visitor ${id.slice(0, 4)}`;