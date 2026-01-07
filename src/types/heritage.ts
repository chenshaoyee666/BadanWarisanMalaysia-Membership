// Heritage site type matching Supabase schema
export interface HeritageSite {
    id: string;
    name: string;
    description?: string;
    location?: string;
    qr_code: string;
    image_url?: string;
    created_at?: string;
}

// Visit record type
export interface HeritageVisit {
    id?: string;
    user_id: string;
    site_id: string;
    visited_at?: string;
    qr_validated?: boolean;
}

// Journal entry type
export interface JournalEntry {
    id?: string;
    user_id: string;
    site_id?: string;
    event_id?: number;
    title: string;
    content: string;
    image_url?: string;
    created_at?: string;
}

// Combined site with visit status for UI
export interface HeritageSiteWithVisit extends HeritageSite {
    visited: boolean;
    visit_date?: string;
}
