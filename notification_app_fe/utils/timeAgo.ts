export function timeAgo(dateParam: string | number | Date): string {
  if (!dateParam) return "";
  
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  if (days === 1) return 'Yesterday';
  
  return `${days} days ago`;
}
