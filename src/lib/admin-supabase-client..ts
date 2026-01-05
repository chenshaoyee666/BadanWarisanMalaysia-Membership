import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://kgcadwkwbblcwfdzktiu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnY2Fkd2t3YmJsY3dmZHprdGl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMzE0OTMsImV4cCI6MjA4MTYwNzQ5M30.Mk0PcLz5CUwG3Jayb9kC4wDS7EA9nxMO9qW70tWCaKQ";

export const supabase = createClient(supabaseUrl, supabaseKey);


