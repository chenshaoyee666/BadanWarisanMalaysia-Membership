import React, { useState } from 'react';
import { supabase } from '../lib/admin-supabase-client.'; // Adjust path as needed

interface DownloadCsvOptions {
    tableName: string;
    fileName?: string;
    startDate?: string; // Format: 'YYYY-MM-DD'
    endDate?: string;   // Format: 'YYYY-MM-DD'
    dateColumn?: string; // The column to filter by (default: 'created_at')
}

export const downloadTableAsCsv = async ({
    tableName,
    fileName = 'table-export',
    startDate,
    endDate,
    dateColumn = 'created_at' // Default assumption
}: DownloadCsvOptions) => {
    try {
        // 1. Start the query
        let query = supabase
            .from(tableName)
            .select('*');

        // 2. Apply Date Filters (if provided)
        if (startDate) {
            // "Greater than or equal to" start date
            query = query.gte(dateColumn, startDate);
        }

        if (endDate) {
            // "Less than or equal to" end date (append time to ensure full day coverage)
            query = query.lte(dateColumn, `${endDate}T23:59:59`);
        }

        // 3. Execute and get CSV
        // We must cast the query result because .csv() changes the return type
        const { data, error } = await query.csv();

        if (error) throw error;
        if (!data) {
            alert('No data found for this date range.');
            return;
        }

        // 4. Handle Browser Download
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const timestamp = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `${fileName}-${timestamp}.csv`);

        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

    } catch (err) {
        console.error('Error downloading CSV:', err);
        alert('Failed to download CSV.');
        throw err; // Re-throw so caller knows it failed
    }
};


// Helper: Delete old reports (> 3 months)
const cleanupOldReports = async () => {
    try {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        // 1. Get old records
        const { data: oldRecords, error: fetchError } = await supabase
            .from('report_history')
            .select('*')
            .lt('created_at', threeMonthsAgo.toISOString());

        if (fetchError) throw fetchError;
        if (!oldRecords || oldRecords.length === 0) return;

        // 2. Delete files from Storage
        const filePaths = oldRecords.map(r => r.file_path);
        if (filePaths.length > 0) {
            const { error: storageError } = await supabase.storage
                .from('reports')
                .remove(filePaths);
            if (storageError) console.error('Error deleting old files:', storageError);
        }

        // 3. Delete records from DB
        const ids = oldRecords.map(r => r.id);
        if (ids.length > 0) {
            const { error: dbError } = await supabase
                .from('report_history')
                .delete()
                .in('id', ids);
            if (dbError) console.error('Error deleting old records:', dbError);
        }

    } catch (error) {
        console.error('Cleanup failed:', error);
    }
};

export const generateAndSaveReport = async (tableName: string = 'admin_event_post') => {
    try {
        // 1. Fetch Data
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .csv();

        if (error) throw error;
        if (!data) throw new Error('No data available to generate report');

        // 2. Prepare File
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `events_report_${timestamp}.csv`;
        const filePath = `${fileName}`;
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });

        // 3. Upload to Storage
        const { error: uploadError } = await supabase.storage
            .from('reports')
            .upload(filePath, blob);

        if (uploadError) throw uploadError;

        // 4. Record in DB
        const { error: dbError } = await supabase
            .from('report_history')
            .insert([{
                file_name: `All Events Report - ${new Date().toLocaleDateString()}`,
                file_path: filePath
            }]);

        if (dbError) throw dbError;

        // 5. Trigger Cleanup (Fire and forget)
        cleanupOldReports();

        return true;

    } catch (error: any) {
        console.error('Error generating report:', error);
        throw error;
    }
};

export const downloadReportFromStorage = async (filePath: string, originalFileName: string) => {
    try {
        const { data, error } = await supabase.storage
            .from('reports')
            .download(filePath);

        if (error) throw error;
        if (!data) throw new Error('Download failed');

        // Create download link
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${originalFileName}.csv`); // Add .csv extension for safety
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

    } catch (error: any) {
        alert(`Failed to download report: ${error.message}`);
    }
};

export const deleteReport = async (id: string, filePath: string) => {
    try {
        // 1. Delete from Storage
        const { error: storageError } = await supabase.storage
            .from('reports')
            .remove([filePath]);

        if (storageError) {
            console.error('Error deleting file from storage:', storageError);
            // We continue to delete the record even if storage delete fails (or maybe file was already gone)
        }

        // 2. Delete from DB
        const { error: dbError } = await supabase
            .from('report_history')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        return true;
    } catch (error: any) {
        console.error('Error deleting report:', error);
        throw error;
    }
};

// ... keep existing components if needed for other parts, or just export these functions
interface DownloadCsvButtonProps extends DownloadCsvOptions {
    className?: string; // Add className prop
}

const DownloadCsvButton: React.FC<DownloadCsvButtonProps> = (props) => {
    // ... existing implementation ...
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDownload = async () => {
        setIsLoading(true);
        try {
            await downloadTableAsCsv(props);
        } catch (error) {
            // Error already handled/alerted in function
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isLoading}
            className={`
        px-4 py-2 rounded-md font-medium text-white transition-colors text-sm
        ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}
        ${props.className || ''}
      `}
        >
            {isLoading ? 'Processing...' : `Export CSV ${props.startDate ? '(Filtered)' : ''}`}
        </button>
    );
};

export default DownloadCsvButton;
