const KEY = "kasa_user";

export function saveUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUser() {
  try {
    const stored = localStorage.getItem(KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(KEY);
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(KEY);
}
