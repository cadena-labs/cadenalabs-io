const MAX_EMAIL_LENGTH = 254;

const LOCAL_PART_SPECIALS = new Set([
  "!",
  "#",
  "$",
  "%",
  "&",
  "'",
  "*",
  "+",
  "/",
  "=",
  "?",
  "^",
  "_",
  "`",
  "{",
  "|",
  "}",
  "~",
  ".",
  "-",
]);

function isAsciiLetter(char: string): boolean {
  const code = char.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

function isDigit(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= 48 && code <= 57;
}

function hasWhitespace(value: string): boolean {
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code <= 32 || code === 127) return true;
  }

  return false;
}

function isValidLocalChar(char: string): boolean {
  return isAsciiLetter(char) || isDigit(char) || LOCAL_PART_SPECIALS.has(char);
}

function isValidDomainLabel(label: string): boolean {
  if (!label || label.startsWith("-") || label.endsWith("-")) return false;

  for (const char of label) {
    if (!isAsciiLetter(char) && !isDigit(char) && char !== "-") {
      return false;
    }
  }

  return true;
}

// Linear-time email validator. Replaces the prior regex to keep contact-form
// input off any backtracking-vulnerable code path.
export function isValidEmail(input: string): boolean {
  const email = input.trim();

  if (!email || email.length > MAX_EMAIL_LENGTH || hasWhitespace(email)) {
    return false;
  }

  const atIndex = email.indexOf("@");
  if (
    atIndex <= 0 ||
    atIndex !== email.lastIndexOf("@") ||
    atIndex === email.length - 1
  ) {
    return false;
  }

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (!local || !domain || local.length > 64) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes(".."))
    return false;
  if (
    !domain.includes(".") ||
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.includes("..")
  ) {
    return false;
  }

  for (const char of local) {
    if (!isValidLocalChar(char)) return false;
  }

  return domain.split(".").every(isValidDomainLabel);
}
