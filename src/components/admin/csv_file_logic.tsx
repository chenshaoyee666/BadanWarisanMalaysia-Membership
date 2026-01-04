import { supabase } from './supabase-client';

interface Membership {
    id: string;
    full_name: string;
    email: string;
    tier: string;
    status: string;
    company_name?: string;
    phone_number?: string;
    created_at: string;
    updated_at?: string;
}

/**
 * Converts an array of memberships to CSV format
 */
export function convertToCSV(memberships: Membership[]): string {
    if (memberships.length === 0) {
        return 'No data available';
    }

    // Define CSV headers
    const headers = [
        'ID',
        'Full Name',
        'Email',
        'Phone Number',
        'Company Name',
        'Tier',
        'Status',
        'Created At',
        'Updated At'
    ];

    // Create CSV rows
    const rows = memberships.map(member => [
        member.id,
        member.full_name || '',
        member.email || '',
        member.phone_number || '',
        member.company_name || '',
        member.tier || '',
        member.status || '',
        new Date(member.created_at).toLocaleString(),
        member.updated_at ? new Date(member.updated_at).toLocaleString() : ''
    ]);

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    return csvContent;
}

/**
 * Downloads CSV content as a file
 */
export function downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

/**
 * Generates and downloads CSV for a single membership
 */
export function generateMembershipCSV(membership: Membership): void {
    const csvContent = convertToCSV([membership]);
    const filename = `membership_${membership.full_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
}

/**
 * Generates CSV for all memberships and saves to Supabase Storage
 */
export async function generateAllMembershipsCSV(memberships: Membership[]): Promise<void> {
    const csvContent = convertToCSV(memberships);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `all_memberships_${timestamp}.csv`;
    const filePath = `reports/${filename}`;

    // Convert CSV string to Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    try {
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('csv-reports')
            .upload(filePath, blob, {
                contentType: 'text/csv',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Save metadata to database
        const { error: dbError } = await supabase
            .from('csv_reports')
            .insert({
                file_name: filename,
                file_path: filePath,
                created_at: new Date().toISOString()
            });

        if (dbError) {
            console.warn('Failed to save CSV metadata to database:', dbError);
            // Continue even if database insert fails - file is already uploaded
        }

        // Also trigger immediate download for user
        downloadCSV(csvContent, filename);

    } catch (error: any) {
        console.error('Error generating CSV:', error);
        // Fallback: just download locally if upload fails
        downloadCSV(csvContent, filename);
        throw new Error('Failed to save CSV to storage, but downloaded locally');
    }
}

/**
 * Cleanup function to delete CSV reports older than 3 months
 * This should be called periodically (e.g., via a cron job or scheduled task)
 */
export async function cleanupOldReports(): Promise<void> {
    try {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        // Get old reports from database
        const { data: oldReports, error: fetchError } = await supabase
            .from('csv_reports')
            .select('*')
            .lt('created_at', threeMonthsAgo.toISOString());

        if (fetchError) throw fetchError;

        if (!oldReports || oldReports.length === 0) {
            console.log('No old reports to clean up');
            return;
        }

        // Delete from storage
        const filePaths = oldReports.map(report => report.file_path);
        const { error: storageError } = await supabase.storage
            .from('csv-reports')
            .remove(filePaths);

        if (storageError) throw storageError;

        // Delete from database
        const { error: dbError } = await supabase
            .from('csv_reports')
            .delete()
            .lt('created_at', threeMonthsAgo.toISOString());

        if (dbError) throw dbError;

        console.log(`Cleaned up ${oldReports.length} old reports`);
    } catch (error) {
        console.error('Error cleaning up old reports:', error);
        throw error;
    }
}
