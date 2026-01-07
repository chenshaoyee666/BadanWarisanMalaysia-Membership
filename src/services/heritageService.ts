import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { HeritageSite, JournalEntry, HeritageSiteWithVisit } from '../types/heritage';

// Demo mode flag - set to false to use Supabase when configured
const USE_DEMO_DATA = false;

// Heritage sites list - each with a unique location for matching
const demoHeritageSites: HeritageSite[] = [
    {
        id: '1',
        name: 'Rumah Penghulu',
        description: 'Traditional Malay house showcasing heritage architecture',
        location: 'Rumah Penghulu',
        qr_code: 'BWM-SITE-001',
    },
    {
        id: '2',
        name: 'Sultan Abdul Samad Building',
        description: 'Iconic Moorish-style building built in 1897',
        location: 'Sultan Abdul Samad Building',
        qr_code: 'BWM-SITE-002',
    },
    {
        id: '3',
        name: "St. Mary's Cathedral",
        description: 'Historic Anglican church established in 1894',
        location: "St. Mary's Cathedral",
        qr_code: 'BWM-SITE-003',
    },
    {
        id: '4',
        name: 'Merdeka Square',
        description: 'Historic square where independence was declared',
        location: 'Merdeka Square',
        qr_code: 'BWM-SITE-004',
    },
    {
        id: '5',
        name: 'George Town Heritage',
        description: 'UNESCO World Heritage Site in Penang',
        location: 'George Town',
        qr_code: 'BWM-SITE-005',
    },
    {
        id: '6',
        name: 'A Famosa Fort',
        description: 'Portuguese fortress built in 1512',
        location: 'Malacca',
        qr_code: 'BWM-SITE-006',
    },
];

// LocalStorage keys for demo mode
const DEMO_REGISTRATIONS_KEY = 'demo_registrations'; // Same key used by eventService
const DEMO_JOURNAL_KEY = 'bwm_journal_entries';

// Helper: Get demo registered events from localStorage (from eventService)
function getDemoRegistrations(): string[] {
    try {
        const stored = localStorage.getItem(DEMO_REGISTRATIONS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Helper: Map event location to heritage site
function getHeritageSiteByLocation(location: string): HeritageSite | undefined {
    // Match event locations to heritage sites
    const locationLower = location.toLowerCase();
    return demoHeritageSites.find(site => {
        const siteLocation = site.location?.toLowerCase() || '';
        // Match if locations overlap
        return locationLower.includes(siteLocation) ||
            siteLocation.includes(locationLower.split(',')[0]) ||
            // Also match partial names
            locationLower.includes(site.name.toLowerCase()) ||
            site.name.toLowerCase().includes(locationLower.split(',')[0]);
    });
}

// Helper: Get demo journal entries
function getDemoJournalEntries(): JournalEntry[] {
    try {
        const stored = localStorage.getItem(DEMO_JOURNAL_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Helper: Save demo journal entry
function saveDemoJournalEntry(entry: JournalEntry): void {
    const entries = getDemoJournalEntries();
    entries.push({ ...entry, id: `demo-${Date.now()}`, created_at: new Date().toISOString() });
    localStorage.setItem(DEMO_JOURNAL_KEY, JSON.stringify(entries));
}

/**
 * Fetch all heritage sites
 */
export async function fetchHeritageSites(): Promise<{ data: HeritageSite[] | null; error: Error | null }> {
    if (USE_DEMO_DATA || !isSupabaseConfigured) {
        return { data: demoHeritageSites, error: null };
    }

    try {
        const { data, error } = await supabase
            .from('heritage_sites')
            .select('*')
            .order('name');

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as Error };
    }
}

/**
 * Fetch heritage sites with user's visit status based on event REGISTRATION
 * A site is "visited" if user registered for an event at that location
 */
export async function fetchHeritageSitesWithVisits(
    userId?: string
): Promise<{ data: HeritageSiteWithVisit[] | null; error: Error | null }> {
    // Always use the hardcoded heritage sites list (no separate table needed)
    const sites = demoHeritageSites;

    // Track which sites have been visited
    const visitedSiteIds: string[] = [];
    const visitDates: Record<string, string> = {};

    // Check event registrations for visits
    if (isSupabaseConfigured && userId) {
        // Supabase mode: Check event_registrations table
        try {
            const { data: registrations, error } = await supabase
                .from('event_registrations')
                .select('event_location, created_at, status')
                .eq('user_id', userId)
                .eq('status', 'attended');

            console.log('Heritage query result:', { registrations, error, userId });

            (registrations || []).forEach((reg: any) => {
                console.log('Processing registration:', reg);
                if (reg.event_location) {
                    // Find matching heritage site by location
                    const matchedSite = sites.find(site => {
                        const regLocation = reg.event_location.toLowerCase();
                        const siteLocation = site.location?.toLowerCase() || '';
                        const siteName = site.name.toLowerCase();

                        const isMatch = regLocation.includes(siteLocation) ||
                            siteLocation.includes(regLocation.split(',')[0]) ||
                            regLocation.includes(siteName) ||
                            siteName.includes(regLocation.split(',')[0]);

                        console.log('Matching check:', { regLocation, siteLocation, siteName, isMatch });
                        return isMatch;
                    });

                    if (matchedSite && !visitedSiteIds.includes(matchedSite.id)) {
                        console.log('Site matched:', matchedSite.name);
                        visitedSiteIds.push(matchedSite.id);
                        visitDates[matchedSite.id] = reg.created_at;
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    } else if (!isSupabaseConfigured) {
        // Demo mode: Check localStorage
        const registeredEvents = getDemoRegistrations();
        const demoEventLocations: Record<string, string> = {
            '1': 'Merdeka Square, KL',
            '2': 'George Town, Penang',
            '3': 'A Famosa Fort, Malacca',
            '4': 'Online Webinar',
            '5': 'Rumah Penghulu, Kuala Lumpur',
            '6': 'Sultan Abdul Samad Building, KL',
            '7': "St. Mary's Cathedral, KL",
        };

        registeredEvents.forEach(eventId => {
            const location = demoEventLocations[eventId];
            if (location && location !== 'Online Webinar') {
                const site = getHeritageSiteByLocation(location);
                if (site && !visitedSiteIds.includes(site.id)) {
                    visitedSiteIds.push(site.id);
                    visitDates[site.id] = new Date().toISOString();
                }
            }
        });
    }

    // Return all sites with visit status
    const sitesWithVisits = sites.map((site) => ({
        ...site,
        visited: visitedSiteIds.includes(site.id),
        visit_date: visitDates[site.id],
    }));

    return { data: sitesWithVisits, error: null };
}

/**
 * Fetch user's journal entries
 */
export async function fetchJournalEntries(
    userId?: string
): Promise<{ data: JournalEntry[] | null; error: Error | null }> {
    if (USE_DEMO_DATA || !isSupabaseConfigured) {
        const entries = getDemoJournalEntries();
        return { data: entries, error: null };
    }

    try {
        let query = supabase.from('journal_entries').select('*').order('created_at', { ascending: false });

        if (userId) {
            query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as Error };
    }
}

/**
 * Create a new journal entry
 */
export async function createJournalEntry(
    entry: Omit<JournalEntry, 'id' | 'created_at'>
): Promise<{ data: JournalEntry | null; error: Error | null }> {
    if (USE_DEMO_DATA || !isSupabaseConfigured) {
        const newEntry: JournalEntry = {
            ...entry,
            id: `demo-${Date.now()}`,
            created_at: new Date().toISOString(),
        };
        saveDemoJournalEntry(newEntry);
        return { data: newEntry, error: null };
    }

    try {
        const { data, error } = await supabase
            .from('journal_entries')
            .insert(entry)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error: error as Error };
    }
}
