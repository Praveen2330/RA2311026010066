const LOG_URL = "http://20.207.122.201/evaluation-service/logs";

export async function Log(stack: string, level: string, pkg: string, message: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("campus_access_token") : null;

  if (!token) return;

  const body = {
    stack,
    level,
    package: pkg,
    message,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(LOG_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      // Token is expired, clear it so we stop sending bad requests
      if (typeof window !== "undefined") {
        localStorage.removeItem("campus_access_token");
      }
    }
  } catch (err: any) {
    console.error("[Logger] Failed to send log:", err.message);
  }
}
