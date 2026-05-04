export type Role = "employee" | "admin";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          [key: string]: unknown;
          id: string;
          full_name: string | null;
          email: string | null;
          role: Role;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          [key: string]: unknown;
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: Role;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          [key: string]: unknown;
          full_name?: string | null;
          email?: string | null;
          role?: Role;
          updated_at?: string;
        };
        Relationships: [];
      };
      work_entries: {
        Row: {
          [key: string]: unknown;
          id: string;
          user_id: string;
          employee_name: string;
          employee_email: string;
          date: string;
          year: number;
          week_number: number;
          object_number: string;
          object_name: string;
          customer_name: string;
          work_description: string;
          hours: string;
          parking_cost: string;
          travel_cost: string;
          city_entry_fee: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          [key: string]: unknown;
          id?: string;
          user_id: string;
          employee_name: string;
          employee_email: string;
          date: string;
          year: number;
          week_number: number;
          object_number: string;
          object_name: string;
          customer_name: string;
          work_description: string;
          hours: string;
          parking_cost?: string;
          travel_cost?: string;
          city_entry_fee?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["work_entries"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type WorkEntry = Database["public"]["Tables"]["work_entries"]["Row"];
