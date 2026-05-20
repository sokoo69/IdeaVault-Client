export const validatePassword = (password) => {
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasMinLength = password.length >= 6
  return hasUppercase && hasLowercase && hasMinLength
}

export const getPasswordErrors = (password) => {
  const errors = []
  if (!password) { errors.push('Password is required'); return errors }
  if (password.length < 6) errors.push('Minimum 6 characters required')
  if (!/[A-Z]/.test(password)) errors.push('Must include uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('Must include lowercase letter')
  return errors
}

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
