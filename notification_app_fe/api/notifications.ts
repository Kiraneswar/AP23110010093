import { getAuthToken } from 'logging-middleware/auth';
import { Log } from 'logging-middleware/logger';
import { Notification } from '../utils/priority';

const BASE_URL = typeof window !== 'undefined' ? '/evaluation-service' : 'http://20.207.122.201/evaluation-service';

export interface FetchNotificationsParams {
  limit?: number;
  page?: number;
  notification_type?: string;
}

export const fetchNotifications = async (params: FetchNotificationsParams): Promise<Notification[]> => {
  try {
    await Log("frontend", "info", "api", "Fetching notifications");

    const token = await getAuthToken();

    const query = new URLSearchParams();
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.page) query.append('page', params.page.toString());
    if (params.notification_type) query.append('notification_type', params.notification_type);

    const response = await fetch(`${BASE_URL}/notifications?${query.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Notifications API] Fetch failed:", response.status, errorText);

      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed: Invalid or expired token (Status ${response.status})`);
      }
      throw new Error(`Failed to fetch notifications (${response.status}): ${errorText}`);
    }

    const rawData = await response.json();
    console.log("[Notifications API] Success Response:", rawData);

    const notificationsArray = rawData.notifications || [];
    const formattedData: Notification[] = notificationsArray.map((n: any) => ({
      id: n.ID || n.id,
      type: n.Type || n.type,
      message: n.Message || n.message,
      timestamp: n.Timestamp || n.timestamp
    }));

    await Log("frontend", "info", "api", `Successfully fetched ${formattedData.length} notifications`);
    return formattedData;
  } catch (error: any) {
    await Log("frontend", "error", "api", `Auth failed or fetch failed: ${error.message}`);
    throw error;
  }
};
