export interface ModerationVideo {
  id: string;
  property_id: string;
  author_id: string;
  media_id: string;
  caption: string;
  published_at: string;
  approval_status: "pending" | "approved" | "rejected";
  view_count: string;
  is_illustrative: boolean;
  _version: string;
  author: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    public_role: string;
  };
  property: {
    id: string;
    code: string;
    title: string;
    province: string;
  };
  media: {
    id: string;
    public_url: string | null;
    thumbnail_url: string | null;
    duration_seconds: number | null;
    alt_text: string;
  };
  likes_count: number;
  comments_count: number;
}
