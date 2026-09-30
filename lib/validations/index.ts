import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export const signupSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  fullName: z.string().trim().min(2, 'Name must have at least 2 characters').max(100),
  role: z.enum(['student', 'organizer']),
  college: z.string().trim().optional(),
  degree: z.string().trim().optional(),
  graduationYear: z.coerce.number().int().min(2020).max(2035).optional().nullable(),
  organizationName: z.string().trim().optional(),
  organizationType: z.string().trim().optional(),
  website: z.string().trim().url('Invalid URL format').or(z.literal('')).optional(),
})

export const opportunityFilterSchema = z.object({
  q: z.string().optional().default(''),
  category: z.string().optional(),
  platform: z.string().optional(),
  mode: z.enum(['all', 'remote', 'offline', 'hybrid', 'any']).optional().default('all'),
  pricing_type: z.enum(['all', 'free', 'paid', 'freemium']).optional().default('all'),
  sort: z.enum(['relevance', 'deadline_asc', 'newest', 'stipend_desc']).optional().default('relevance'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
})

export const saveOpportunitySchema = z.object({
  status: z.enum(['saved', 'applied', 'interviewing', 'offer', 'rejected', 'archived']).default('saved'),
  note: z.string().max(1000).optional().nullable(),
})

export const createReminderSchema = z.object({
  remind_at: z.string().datetime({ message: 'Must be a valid ISO datetime' }),
  channel: z.enum(['in_app', 'email', 'both']).default('in_app'),
})

export const reportOpportunitySchema = z.object({
  reason: z.enum(['scam', 'incorrect', 'expired', 'wrong_link', 'misleading', 'duplicate', 'other']),
  details: z.string().min(5, 'Please provide sufficient details (min 5 chars)').max(1000),
})

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(2, 'Name must have at least 2 characters').max(100),
  phone: z.string().trim().max(20).optional().nullable(),
  bio: z.string().trim().max(600).optional().nullable(),
  college: z.string().trim().max(150).optional().nullable(),
  degree: z.string().trim().max(100).optional().nullable(),
  branch: z.string().trim().max(100).optional().nullable(),
  graduation_year: z.coerce.number().int().min(2000).max(2040).optional().nullable(),
  current_year: z.coerce.number().int().min(1).max(6).optional().nullable(),
  cgpa: z.coerce.number().min(0).max(10).optional().nullable(),
  location: z.string().trim().max(100).optional().nullable(),
  linkedin_url: z.string().trim().url('Invalid URL').or(z.literal('')).optional().nullable(),
  github_url: z.string().trim().url('Invalid URL').or(z.literal('')).optional().nullable(),
  portfolio_url: z.string().trim().url('Invalid URL').or(z.literal('')).optional().nullable(),
  resume_reference: z.string().trim().url('Invalid URL').or(z.literal('')).optional().nullable(),
  avatar_url: z.string().trim().optional().nullable(),
  preferred_categories: z.array(z.string()).default([]),
  preferred_locations: z.array(z.string()).default([]),
  preferred_modes: z.array(z.string()).default([]),
  career_interests: z.array(z.string()).default([]),
  profile_public: z.boolean().default(false),
  email_notifications_enabled: z.boolean().default(true),
  reminders_enabled: z.boolean().default(true),
})

export const updateSkillsSchema = z.object({
  skills: z.array(z.string().trim().min(1).max(60)),
  interests: z.array(z.string().trim().min(1).max(60)),
})

export const consentSchema = z.object({
  consent_type: z.enum([
    'terms_of_service',
    'privacy_policy',
    'analytics_cookies',
    'email_notifications',
    'marketing_communications',
  ]),
  agreed: z.boolean(),
})

export const adminModerationSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending', 'expired', 'removed']),
  moderation_reason: z.string().max(500).optional().nullable(),
  is_verified: z.boolean().optional(),
  is_featured: z.boolean().optional(),
})

export const adminSourceSchema = z.object({
  name: z.string().trim().min(2).max(100),
  feed_url: z.string().trim().url('Invalid URL format'),
  adapter_type: z.enum(['rss', 'json', 'api', 'manual']),
  trust_score: z.coerce.number().min(0).max(1).default(1.0),
  enabled: z.boolean().default(true),
})
