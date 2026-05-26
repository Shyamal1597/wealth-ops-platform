/**
 * Password Validation Utility
 * Enforces strong password requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Minimum length
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // Maximum length (prevent DOS attacks)
  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  // At least one number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // No common passwords (basic check)
  const commonPasswords = [
    'password', 'Password1', '12345678', 'qwerty123',
    'admin123', 'welcome1', 'letmein1', 'Password123'
  ];
  if (commonPasswords.some(common => password.toLowerCase().includes(common.toLowerCase()))) {
    errors.push("Password is too common, please choose a stronger password");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' | 'very-strong' {
  let score = 0;

  // Length score
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Complexity score
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  // Diversity score
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 10) score++;

  if (score <= 3) return 'weak';
  if (score <= 5) return 'medium';
  if (score <= 7) return 'strong';
  return 'very-strong';
}
