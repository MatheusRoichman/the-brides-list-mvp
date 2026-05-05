const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(ip: string, limit: number, windowMs: number) {
  const now = Date.now();
  const state = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - state.lastReset > windowMs) {
    state.count = 0;
    state.lastReset = now;
  }

  if (state.count >= limit) {
    return false;
  }

  state.count++;
  rateLimitMap.set(ip, state);
  return true;
}
