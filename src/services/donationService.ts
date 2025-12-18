import { supabase } from '../lib/supabase';

export interface LeaderboardEntry {
    rank: number;
    name: string;
    amount: number;
    userId: string;
}

export const donationService = {
    /**
     * Records a new donation for the current user
     */
    async addDonation(amount: number, paymentMethod: 'fpx' | 'card' | 'grabpay', campaignId?: string) {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User must be logged in to donate');
        }

        const { error } = await supabase
            .from('donations')
            .insert({
                user_id: user.id,
                amount: amount,
                payment_method: paymentMethod,
                campaign_id: campaignId || 'general'
            });

        if (error) {
            console.error('Error recording donation:', error);
            throw error;
        }
    },

    /**
     * Fetches total amount raised per campaign
     */
    async getCampaignStats(): Promise<Record<string, number>> {
        const { data, error } = await supabase
            .from('donations')
            .select('amount, campaign_id');

        if (error) {
            console.error('Error fetching campaign stats:', error);
            return {};
        }

        const stats: Record<string, number> = {};

        data.forEach(donation => {
            const campaignId = donation.campaign_id || 'general';
            stats[campaignId] = (stats[campaignId] || 0) + Number(donation.amount);
        });

        return stats;
    },

    /**
     * Fetches the donation leaderboard
     * Aggregates total donations per user and joins with profile names
     */
    async getLeaderboard(): Promise<LeaderboardEntry[]> {
        // 1. Fetch all donations
        const { data: donations, error: donationsError } = await supabase
            .from('donations')
            .select('user_id, amount');

        if (donationsError) {
            console.error('Error fetching donations:', donationsError);
            throw donationsError;
        }

        // 2. Fetch all profiles (names)
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name');

        if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
            throw profilesError;
        }

        // 3. Aggregate totals locally (Supabase group_by support in JS client is limited without views/RPC)
        const totals: Record<string, number> = {};
        donations.forEach(donation => {
            totals[donation.user_id] = (totals[donation.user_id] || 0) + Number(donation.amount);
        });

        // 4. Map to leaderboard format
        const leaderboard = Object.entries(totals).map(([userId, totalAmount]) => {
            const profile = profiles.find(p => p.id === userId);
            return {
                userId,
                name: profile?.full_name || 'Anonymous Donor',
                amount: totalAmount,
                rank: 0 // Will assign after sorting
            };
        });

        // 5. Sort by amount descending and assign ranks
        leaderboard.sort((a, b) => b.amount - a.amount);

        return leaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1
        })).slice(0, 10); // Return top 10
    }
};
