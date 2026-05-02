import { Log } from '../../logging_middleware';

export type NotificationType = "Event" | "Result" | "Placement";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string | number | Date;
}

const PRIORITY_WEIGHT: Record<NotificationType, number> = {
  "Placement": 3,
  "Result": 2,
  "Event": 1
};


export async function getTopNotificationsSorted(notifications: Notification[], n = 10): Promise<Notification[]> {
  try {
    await Log("frontend", "info", "utils", `Started computation (Sorted): finding top ${n} of ${notifications.length} notifications`);

    const sorted = [...notifications].sort((a, b) => {
      const weightA = PRIORITY_WEIGHT[a.type] || 0;
      const weightB = PRIORITY_WEIGHT[b.type] || 0;

      if (weightA !== weightB) {
        return weightB - weightA;
      }

      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA;
    });

    const topN = sorted.slice(0, n);
    await Log("frontend", "info", "utils", `Successfully computed top ${n} notifications (Sorted)`);
    return topN;
  } catch (error: any) {
    await Log("frontend", "error", "utils", `Error computing top notifications: ${error.message}`);
    throw error;
  }
}

export async function getTopNotifications(notifications: Notification[], n = 10): Promise<Notification[]> {
  try {
    await Log("frontend", "info", "utils", `Started computation (MinHeap): finding top ${n} of ${notifications.length} notifications`);

    if (n <= 0) return [];
    if (notifications.length <= n) {
      const res = [...notifications].sort((a, b) => {
        const wA = PRIORITY_WEIGHT[a.type] || 0;
        const wB = PRIORITY_WEIGHT[b.type] || 0;
        if (wA !== wB) return wB - wA;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      await Log("frontend", "info", "utils", `Successfully computed top notifications (Array size <= N)`);
      return res;
    }
    const minHeapCompare = (a: Notification, b: Notification) => {
      const weightA = PRIORITY_WEIGHT[a.type] || 0;
      const weightB = PRIORITY_WEIGHT[b.type] || 0;

      if (weightA !== weightB) {
        return weightA - weightB;
      }

      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeA - timeB;
    };

    const heap: Notification[] = [];

    const bubbleUp = (index: number) => {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (minHeapCompare(heap[index], heap[parent]) >= 0) break;
        [heap[index], heap[parent]] = [heap[parent], heap[index]];
        index = parent;
      }
    };

    const bubbleDown = (index: number) => {
      while (true) {
        let smallest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;

        if (left < heap.length && minHeapCompare(heap[left], heap[smallest]) < 0) smallest = left;
        if (right < heap.length && minHeapCompare(heap[right], heap[smallest]) < 0) smallest = right;
        if (smallest === index) break;

        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        index = smallest;
      }
    };

    for (const notif of notifications) {
      if (heap.length < n) {
        heap.push(notif);
        bubbleUp(heap.length - 1);
      } else {
        if (minHeapCompare(notif, heap[0]) > 0) {
          heap[0] = notif;
          bubbleDown(0);
        }
      }
    }

    const topN = heap.sort((a, b) => {
      const wA = PRIORITY_WEIGHT[a.type] || 0;
      const wB = PRIORITY_WEIGHT[b.type] || 0;
      if (wA !== wB) return wB - wA;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    await Log("frontend", "info", "utils", `Successfully computed top ${n} notifications (MinHeap)`);
    return topN;
  } catch (error: any) {
    await Log("frontend", "error", "utils", `Error computing top notifications: ${error.message}`);
    throw error;
  }
}
