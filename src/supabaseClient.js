import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ahbqwdvotjqyjjicsvdf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoYnF3ZHZvdGpxeWpqaWNzdmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTAzMzUsImV4cCI6MjA4MDkyNjMzNX0.mgZsIi-9IWymRDN6i65F7Przbt4wxIWPatXYz6tjk0I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
