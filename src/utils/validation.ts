
import { z } from 'zod';

// Schema for patient data validation
export const patientDataSchema = z.object({
  patientInitials: z.string()
    .max(10, 'Patient initials must be 10 characters or less')
    .regex(/^[A-Za-z.\s]*$/, 'Patient initials can only contain letters, periods, and spaces')
    .optional(),
  age: z.number()
    .min(2, 'Age must be at least 2')
    .max(18, 'Age must be at most 18'),
  disorderArea: z.string()
    .min(1, 'Primary disorder area is required')
    .max(50, 'Disorder area name is too long'),
  secondaryDisorderArea: z.string()
    .max(50, 'Secondary disorder area name is too long')
    .optional(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .refine(val => val.trim().length > 0, 'Description cannot be empty'),
});

// Schema for manual goals validation
export const manualGoalsSchema = z.object({
  longTermGoal: z.string()
    .min(10, 'Long-term goal must be at least 10 characters')
    .max(1000, 'Long-term goal must be less than 1000 characters')
    .refine(val => val.trim().length > 0, 'Long-term goal cannot be empty'),
  objectives: z.array(z.string()
    .min(5, 'Each objective must be at least 5 characters')
    .max(500, 'Each objective must be less than 500 characters'))
    .min(1, 'At least one objective is required')
    .max(10, 'Maximum 10 objectives allowed'),
});

// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Validate and sanitize patient data
export const validatePatientData = (data: any) => {
  // Sanitize string fields
  const sanitizedData = {
    ...data,
    patientInitials: data.patientInitials ? sanitizeHtml(data.patientInitials) : undefined,
    disorderArea: sanitizeHtml(data.disorderArea),
    secondaryDisorderArea: data.secondaryDisorderArea ? sanitizeHtml(data.secondaryDisorderArea) : undefined,
    description: sanitizeHtml(data.description),
  };

  return patientDataSchema.parse(sanitizedData);
};

// Validate and sanitize manual goals
export const validateManualGoals = (data: any) => {
  const sanitizedData = {
    longTermGoal: sanitizeHtml(data.longTermGoal),
    objectives: data.objectives.map((obj: string) => sanitizeHtml(obj)),
  };

  return manualGoalsSchema.parse(sanitizedData);
};

// Rate limiting utility
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 5, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Filter out old requests
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
}

export const apiRateLimiter = new RateLimiter(3, 60000); // 3 requests per minute
