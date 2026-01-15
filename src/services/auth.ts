// Auth service placeholder
// Firebase auth will be set up later - currently using mock auth via useAuth hook

export async function signUp(email: string, password: string, username: string, displayName: string) {
  console.log('Auth service: signUp called - use useAuth hook instead');
  throw new Error('Use useAuth hook for authentication');
}

export async function signIn(email: string, password: string) {
  console.log('Auth service: signIn called - use useAuth hook instead');
  throw new Error('Use useAuth hook for authentication');
}

export async function signInWithGoogle() {
  console.log('Auth service: signInWithGoogle called - use useAuth hook instead');
  throw new Error('Use useAuth hook for authentication');
}

export async function signOut() {
  console.log('Auth service: signOut called - use useAuth hook instead');
  throw new Error('Use useAuth hook for authentication');
}

export function onAuthChange(callback: (user: null) => void) {
  // No-op in mock mode
  callback(null);
  return () => {};
}
