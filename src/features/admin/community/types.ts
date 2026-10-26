import type {Row} from "../api";

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  attendee_count: number;
  contact_name: string;
  contact_phone: string;
  status: "pending" | "registered" | "cancelled";
  ticket_price_snapshot: string;
  payment_mode: string;
  created_at: string;
  _version?: string;
}

export interface EventAggregate extends Row {
  id: string;
  title: string;
  venue_name: string;
  address: string;
  starts_at: string;
  ends_at: string;
  max_slots: number;
  duration_mins: number;
  ticket_price: string;
  status: "open" | "sold_out" | "closed" | "cancelled";
  agenda: {startsAt: string; title: string; description?: string}[];
  speakers: {name: string; role: string; description?: string; avatarUrl?: string | null}[];
  benefits: {title: string; description: string}[];
  is_illustrative: boolean;
  _version: string;

  registrations: EventRegistration[];
  registered_attendees: number;
  pending_attendees: number;
}
