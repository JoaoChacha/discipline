export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateSignIn(input: { email: string; password: string }) {
  if (!isValidEmail(input.email)) {
    return "Enter a valid email address.";
  }
  if (input.password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
}

export function validateSignUp(input: {
  name: string;
  email: string;
  password: string;
}) {
  if (input.name.trim().length < 2) {
    return "Enter the name you want on this account.";
  }
  return validateSignIn(input);
}
