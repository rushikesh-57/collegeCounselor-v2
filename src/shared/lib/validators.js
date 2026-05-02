export function validateMobileNumber(value) {
  return /^\d{10}$/.test(value || '');
}

export function validateRequiredFields(values, requiredKeys) {
  return requiredKeys.filter((key) => !values[key]);
}
