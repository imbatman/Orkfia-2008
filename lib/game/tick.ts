/**
 * Game tick (idempotent placeholder)
 *
 * This function will be triggered by a scheduler to advance game time and
 * execute hourly events. It must be safe to run multiple times for the same window.
 */
export async function runGameTick(now = new Date()): Promise<{ ran: boolean; window: string }> {
  // TODO: Implement DB-backed locking and state updates
  const windowKey = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}-${now.getUTCHours()}`;
  // For now, just return a stubbed result
  return { ran: true, window: windowKey };
}
