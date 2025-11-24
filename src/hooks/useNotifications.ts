import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
    setNotifications,
    addNotification,
    markAllRead,
    markAsRead,
    setLoading,
    setError
} from "@/store/slices/notificationsSlice";
import {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    subscribeToNotifications,
} from "@/services/notifications";
import type { Notification } from "@/types";
import toast from "react-hot-toast";

export const useNotifications = () => {
    const dispatch = useDispatch();
    const { notifications, unreadCount, loading, error } = useSelector((state: RootState) => state.notifications);
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    // 1. Initial Fetch
    useEffect(() => {
        if (!userId) {
            dispatch(setNotifications([]));
            dispatch(setLoading(false));
            return;
        };

        const fetchNotifications = async () => {
            dispatch(setLoading(true));
            try {
                const data = await getNotifications(userId);
                dispatch(setNotifications(data));
            } catch (error: any) {
                dispatch(setError(error.message || 'Failed to load notifications'));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchNotifications();
    }, [dispatch, userId]);

    // 2. Real-time Subscription
    useEffect(() => {
        if (!userId) return;

        const subscription = subscribeToNotifications(userId, (payload) => {
            const newNotification = payload.new as Notification;
            dispatch(addNotification(newNotification));

            const sender = newNotification.data?.senderUsername || "Someone";
            const type = newNotification.type;

            let message = "New notification!";

            // Custom messages based on type
            switch (type) {
                case "new_comment":
                    message = `${sender} commented on your post`;
                    break;
                case "new_like":
                    message = `${sender} liked your post`;
                    break;
                case "new_follower":
                    message = `${sender} started following you`;
                    break;
            }

            toast.success(message, {
                duration: 4000,
                position: 'top-right',
                icon: '🔔',
            });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch, userId]);

    // --- Actions ---

    const handleMarkAsRead = useCallback(async (notificationId: string): Promise<void> => {
        dispatch(markAsRead(notificationId));
        try {
            await markNotificationAsRead(notificationId);
        } catch (error: any) {
            const message = error.message || "Failed to mark as read";
            toast.error(message);
        }
    }, [dispatch]);

    const handleMarkAllRead = useCallback(async (): Promise<void> => {
        if (!userId || unreadCount === 0) return;

        dispatch(markAllRead());
        try {
            await markAllNotificationsAsRead(userId);
            toast.success("All marked as read");
        } catch (error: any) {
            const message = error.message || "Failed to mark all as read";
            toast.error(message);
        }
    }, [dispatch, userId, unreadCount]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead: handleMarkAsRead,
        markAllRead: handleMarkAllRead,
    };
};