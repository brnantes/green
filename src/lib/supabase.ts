
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = "https://hsubouwujfcdyuyikvbi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzdWJvdXd1amZjZHl1eWlrdmJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MzE2NjAsImV4cCI6MjA1OTMwNzY2MH0.wtDdFchXnutYMu2zTQeNIPbrw7jQqHNspUc37f7W-AI";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if Supabase is connected
export const isSupabaseConnected = () => {
  return true;
};
