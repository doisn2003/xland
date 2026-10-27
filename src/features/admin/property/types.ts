import type {Row} from "../api";

export interface PropertyMediaItem {
  id: string;
  property_id: string;
  kind: "image" | "video";
  usage: "gallery" | "area" | "feed";
  storage_key: string | null;
  public_url: string | null;
  thumbnail_url: string | null;
  alt_text: string | null;
  duration_seconds: number | null;
  sort_order: number;
  is_illustrative: boolean;
  _version?: string;
}

export interface PropertyLegalItem {
  id: string;
  property_id: string;
  title: string;
  subtitle: string | null;
  checked_date: string | null;
  status: "pending" | "verified";
  sort_order: number;
  _version?: string;
}

export interface PropertyDocumentItem {
  id: string;
  property_id: string;
  title: string;
  file_type: string;
  mime_type: string;
  size_bytes: string;
  uploaded_date: string;
  storage_key: string | null;
  access_level: "public_redacted" | "authenticated" | "granted";
  public_preview_url: string | null;
  is_illustrative: boolean;
  _version?: string;
}

export interface PropertyAmenityItem {
  id: string;
  property_id: string;
  category: "utility" | "traffic" | "living";
  name: string;
  distance_text: string;
  icon_type: string | null;
  approximate_lat: string | null;
  approximate_lng: string | null;
  sort_order: number;
  _version?: string;
}

export interface PropertySlotSummary {
  id: string;
  property_id: string;
  label: string;
  starts_at: string;
  ends_at: string;
  max_attendees: number;
  max_bookings: number;
  status: string;
  approximate_meeting_lat: string | null;
  approximate_meeting_lng: string | null;
  radius_m: number | null;
  is_illustrative: boolean;
  _version?: string;
}

export interface PropertyBookingSummary {
  id: string;
  property_id: string;
  customer_name: string;
  customer_phone: string;
  requested_starts_at: string;
  confirmed_starts_at: string | null;
  attendee_count: number;
  status: string;
  confirmed_meeting_label: string | null;
  _version?: string;
}

export interface PropertyAggregate extends Row {
  has_subplots?: boolean;
  parent_property_id?: string | null;
  is_corner?: boolean;
  parent?: {id:string;code:string;title:string} | null;
  subdivision?: {total:number;allocated_area_m2:string;remaining_area_m2:string;listed:number;sold:number;pending:number};
  id: string;
  code: string;
  title: string;
  province: string;
  province_code: string;
  district: string;
  district_code: string;
  catalog_version: string;
  region: "north" | "central" | "south";
  category: "residential" | "industrial" | "agricultural" | "other";
  land_type: string;
  area_m2: string;
  price_total: string;
  price_per_m2?: string;
  status: "listed" | "paused" | "sold";
  approval_status: "pending" | "approved";
  consultant_id: string;
  consultant_name?: string | null;
  highlights: {title: string; description: string}[];
  lat?: string | null;
  lng?: string | null;
  approximate_lat?: string | null;
  approximate_lng?: string | null;
  approximate_radius_m?: number | null;
  address_custom?: string | null;
  description_override?: string | null;
  direction?: string | null;
  road_width_m?: string | null;
  frontage_width_m?: string | null;
  legal_status_summary?: string | null;
  status_badge?: string | null;
  is_featured?: boolean;
  published_at?: string | null;
  _version: string;

  media: PropertyMediaItem[];
  legal_items: PropertyLegalItem[];
  documents: PropertyDocumentItem[];
  amenities: PropertyAmenityItem[];
  slots: PropertySlotSummary[];
  bookings: PropertyBookingSummary[];
}

export type StudioTab = "basic" | "media" | "legal" | "documents" | "amenities" | "children";
