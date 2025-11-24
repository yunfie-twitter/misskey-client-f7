import { defineStore } from 'pinia';
import { misskeyApi } from '@/utils/api';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    loading: false,
  }),
  
  actions: {
    async fetchNotifications(limit = 20, untilId = null) {
      this.loading = true;
      try {
        const params = { limit };
        if (untilId) params.untilId = untilId;
        
        const notifications = await misskeyApi('i/notifications', params);
        
        if (untilId) {
          this.notifications.push(...notifications);
        } else {
          this.notifications = notifications;
        }
        
        this.updateUnreadCount();
        return notifications;
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async markAsRead() {
      try {
        await misskeyApi('notifications/mark-all-as-read', {});
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    },
    
    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    }
  }
});
