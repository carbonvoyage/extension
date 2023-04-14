export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      charities: {
        Row: {
          description: string | null
          id: number
          location: string | null
          name: string | null
          total_donated: number | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          location?: string | null
          name?: string | null
          total_donated?: number | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          location?: string | null
          name?: string | null
          total_donated?: number | null
          user_id?: string | null
          website?: string | null
        }
      }
      products: {
        Row: {
          emissions: number | null
          height: number | null
          id: number
          length: number | null
          materials: string[] | null
          offset_paid: number | null
          offset_price: number | null
          price: number | null
          title: string | null
          transaction_id: number | null
          user_id: string
          weight: number | null
          width: number | null
        }
        Insert: {
          emissions?: number | null
          height?: number | null
          id?: number
          length?: number | null
          materials?: string[] | null
          offset_paid?: number | null
          offset_price?: number | null
          price?: number | null
          title?: string | null
          transaction_id?: number | null
          user_id: string
          weight?: number | null
          width?: number | null
        }
        Update: {
          emissions?: number | null
          height?: number | null
          id?: number
          length?: number | null
          materials?: string[] | null
          offset_paid?: number | null
          offset_price?: number | null
          price?: number | null
          title?: string | null
          transaction_id?: number | null
          user_id?: string
          weight?: number | null
          width?: number | null
        }
      }
      transactions: {
        Row: {
          created_at: string | null
          donated: boolean
          donated_at: string | null
          id: number
          offset: number
          selected_charity: number
          total: number
          user_id: string
          website: string | null
        }
        Insert: {
          created_at?: string | null
          donated: boolean
          donated_at?: string | null
          id?: number
          offset: number
          selected_charity: number
          total: number
          user_id: string
          website?: string | null
        }
        Update: {
          created_at?: string | null
          donated?: boolean
          donated_at?: string | null
          id?: number
          offset?: number
          selected_charity?: number
          total?: number
          user_id?: string
          website?: string | null
        }
      }
      users: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string
          last_name: string | null
          selected_charity: number | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          selected_charity?: number | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          selected_charity?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
