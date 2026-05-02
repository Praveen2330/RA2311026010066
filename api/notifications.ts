import { Log } from "../utils/logger";

const BASE_URL = "http://20.207.122.201/evaluation-service";

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 300,
  Result: 200,
  Event: 100,
};

export async function fetchNotifications() {
  await Log("frontend", "INFO", "api_fetch", "Initiating notifications fetch");
  
  const token = typeof window !== "undefined" ? localStorage.getItem("campus_access_token") : null;
  
  if (!token) {
    throw new Error("No access token found. Please log in.");
  }

  try {
    const response = await fetch(`${BASE_URL}/notifications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized (401). Token may be expired.");
      }
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    await Log("frontend", "INFO", "api_fetch", "Fetch notifications success");
    return Array.isArray(data) ? data : data.notifications ?? [];
  } catch (error: any) {
    await Log("frontend", "ERROR", "api_fetch", `Fetch failed: ${error.message}`);
    throw error; // Re-throw so the dashboard catches it
  }
}

function computePriority(notification: any) {
  const type = notification.type || notification.category || "Event";
  const weight = TYPE_WEIGHT[type] ?? 0;

  // Normalise timestamp to keep weight dominant
  const ts = notification.timestamp
    ? new Date(notification.timestamp).getTime() / 1e10
    : 0;

  return weight + ts;
}

export function getTop10Notifications(notifications: any[]) {
  return [...notifications]
    .map((n) => ({ ...n, _priority: computePriority(n) }))
    .sort((a, b) => b._priority - a._priority)
    .slice(0, 10);
}
