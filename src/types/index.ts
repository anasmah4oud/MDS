/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  student_code: number;
  first_name: string;
  last_name: string;
  governorate: string;
  city: string;
  phone: string;
  parent_phone: string;
  email: string;
  grade: 1 | 2 | 3;
  track: 'scientific' | 'literary';
  birth_date: string;
  gender: 'male' | 'female';
  photo_url?: string;
  wallet_balance: number;
  role: 'student' | 'admin';
  is_blocked: boolean;
  created_at: any;
}

export interface Package {
  id: number;
  grade_id: 1 | 2 | 3;
  name: string;
  description: string;
  type: 'offer' | 'monthly' | 'weekly' | 'quarterly';
  price: number;
  old_price?: number;
  image_url: string;
  is_free: boolean;
  created_at: any;
}

export interface Week {
  id: number;
  package_id: number;
  name: string;
  description: string;
  created_at: any;
}

export interface Lesson {
  id: number;
  week_id: number;
  name: string;
  description: string;
  type: 'video_exp' | 'video_hw' | 'pdf' | 'exam_mcq' | 'hw_mcq';
  url: string;
  created_at: any;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'deposit' | 'purchase';
  description: string;
  created_at: any;
}

export interface ActivationCode {
  id: number;
  code: string;
  package_id: number;
  is_used: boolean;
  used_by?: string;
  created_at: any;
}
