let activeCount = 0;
const waiting = [];
const LIMIT = 3;

export async function queueRequest(fn) {
  if (activeCount >= LIMIT) {
    await new Promise((resolve) => waiting.push(resolve));
  }

  activeCount++;
  try {
    return await fn();
  } finally {
    activeCount--;
    if (waiting.length > 0) {
      const next = waiting.shift();
      next();
    }
  }
}

/* with logs  */
// queueHelper.js
/* let activeCount = 0;
const waiting = [];
const LIMIT = 5; // Maximum concurrent requests

export async function queueRequest(fn) {
  console.log(
    "[queueRequest] Incoming request. Active:",
    activeCount,
    "Waiting:",
    waiting.length
  );

  if (activeCount >= LIMIT) {
    console.log(
      "[queueRequest] Limit reached. Putting request in waiting queue."
    );
    await new Promise((resolve) => waiting.push(resolve));
    console.log("[queueRequest] Request dequeued. Ready to run.");
  }

  activeCount++;
  console.log("[queueRequest] Starting request. Active now:", activeCount);

  try {
    const result = await fn();
    console.log("[queueRequest] Request finished successfully.");
    return result;
  } catch (err) {
    console.error("[queueRequest] Request failed:", err.message);
    throw err;
  } finally {
    activeCount--;
    console.log("[queueRequest] Request completed. Active now:", activeCount);

    if (waiting.length > 0) {
      console.log("[queueRequest] Waking up next request from queue.");
      const next = waiting.shift();
      next(); // allow next in queue
    } else {
      console.log("[queueRequest] No waiting requests.");
    }
  }
}
 */
