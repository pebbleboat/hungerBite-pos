function diffMinutes(from?: string | null, to: Date = new Date()): number {
  if (!from) return 0;
  const start = new Date(from).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, Math.floor((to.getTime() - start) / 60000));
}

function diffMs(from?: string | null, to: Date = new Date()): number {
  if (!from) return 0;
  const start = new Date(from).getTime();
  if (Number.isNaN(start)) return 0;
  return Math.max(0, to.getTime() - start);
}

export function formatMinAgo(createdAt?: string | null): string {
  const m = diffMinutes(createdAt);
  if (!m) return "JUST NOW";
  if (m === 1) return "1 MIN AGO";
  return `${m} MINS AGO`;
}

export function formatInStatus(since?: string | null): string {
  const ms = diffMs(since);
  if (!ms) return "00:00 in status";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds} in status`;
}

export function formatWaiting(since?: string | null): string {
  const ms = diffMs(since);
  if (!ms) return "00:00 waiting";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds} waiting`;
}

export function isPendingUrgent(createdAt?: string | null): boolean {
  return diffMinutes(createdAt) >= 10;
}

export function isPreparingUrgent(since?: string | null): boolean {
  return diffMinutes(since) >= 15;
}
