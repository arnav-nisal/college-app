export type UserRole = "student" | "staff" | "head" | "super_admin";

export interface User {
  id: string;
  google_sub: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole | string;
  college_id: string | null;
  department: string | null;
  academic_year: string | null;
  division: string | null;
  bio: string | null;
  dm_enabled: boolean;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  is_profile_complete: boolean;
  user: User;
}

export interface OnboardingPayload {
  college_id: string;
  department: string;
  academic_year?: string | null;
  division?: string | null;
  bio?: string | null;
}
