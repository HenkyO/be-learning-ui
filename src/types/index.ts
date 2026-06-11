/**
 * Global Type Definitions for Be Learning LMS
 */

// ============= AUTH TYPES =============
export interface UserProfile {
  id: string
  full_name: string
  nip: string
  role: 'Administrator' | 'Mentor' | 'Pegawai'
  email: string
  created_at?: string
  updated_at?: string
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: Record<string, any>
  aud?: string
}

export interface AuthSession {
  user: AuthUser | null
  access_token: string | null
  refresh_token: string | null
}

// ============= ERROR TYPES =============
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
  status?: number
  timestamp?: Date
}

export interface ErrorContext {
  action: string
  resource?: string
  userId?: string
  error: ApiError | Error
}

// ============= NOTIFICATION TYPES =============
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
  action?: {
    label: string
    callback: () => void
  }
}

// ============= SESSION TYPES =============
export interface SessionData {
  id: string
  user_id: string
  csrf_token: string
  last_activity: Date
  expires_at: Date
  created_at: Date
}

export interface LoginAttempt {
  email: string
  ip_address: string
  success: boolean
  timestamp: Date
  attempt_number?: number
}

// ============= RATE LIMIT TYPES =============
export interface RateLimitConfig {
  max_attempts: number
  lockout_duration_ms: number
  reset_duration_ms: number
}

export interface RateLimitState {
  attempts: number
  last_attempt: Date | null
  locked_until: Date | null
}

// ============= FORM VALIDATION TYPES =============
export interface ValidationRule {
  type: 'email' | 'password' | 'required' | 'minLength' | 'maxLength' | 'pattern'
  value?: string | number | RegExp
  message: string
}

export interface FormValidationResult {
  valid: boolean
  errors: Record<string, string>
}

// ============= LEARNING TYPES =============
export interface Subject {
  id: string
  module_id: string
  title: string
  description: string
  storage_path: string
  content_type: 'pdf' | 'video' | 'text'
  order_index: number
  created_at?: string
  updated_at?: string
}

export interface UserSubjectProgress {
  id: string
  user_id: string
  subject_id: string
  status: 'Belum Selesai' | 'Selesai'
  completed_at?: string
}

export interface Module {
  id: string
  title: string
  description: string
  level: 'Basic' | 'Intermediate' | 'Advanced'
  order: number
  created_at: string
  subjects?: Subject[]
}

export interface Quiz {
  id: string
  module_id: string
  title: string
  questions: Question[]
  time_limit_minutes?: number
  passing_score: number
}

export interface QuestionOption {
  text: string
}

export interface Question {
  id: string
  module_id: string
  question_text: string
  options: QuestionOption[]
  explanation?: string
  shuffledOptions?: Array<QuestionOption & { displayLabel: string }>
}

export interface UserProgress {
  id: string
  user_id: string
  module_id: string
  status: 'Not Started' | 'In Progress' | 'Completed'
  progress_percentage: number
  started_at?: string
  completed_at?: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  answers: Record<string, string>
  attempt_number: number
  status: 'Passed' | 'Failed'
  created_at: string
}

// ============= AUDIT LOG TYPES =============
export interface AuditLog {
  id: string
  user_id?: string
  action: string
  resource: string
  old_value?: any
  new_value?: any
  ip_address?: string
  user_agent?: string
  created_at: Date
}

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp: Date
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// ============= UTILITY TYPES =============
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Result<T> = { ok: true; value: T } | { ok: false; error: Error }