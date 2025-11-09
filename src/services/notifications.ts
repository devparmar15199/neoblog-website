import { supabase } from "@/lib/supabase";
import type { Notification } from "@/types";

// Get all notifications for the logged-in user
export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to latest 50 notifications
    if (error) throw error;
    return data as Notification[];
};

// Mark a single notification as read
export const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
    if (error) throw error;
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId: string) => {
    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);  // Only update unread notifications
    if (error) throw error;
};

// Subscribe to new notifications
export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
    return supabase
        .channel(`notifications:${userId}`)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
            callback
        ).subscribe();
};