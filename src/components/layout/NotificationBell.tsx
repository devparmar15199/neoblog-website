import { Bell } from "lucide-react";
import { Button } from "../ui/Button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (id: string, postId?: string) => {
    markAsRead(id);
    if (postId) navigate(`/post/${postId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-600 animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 max-h-[400px] overflow-y-auto" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span
              onClick={() => markAllRead()}
              className="text-xs text-blue-500 cursor-pointer hover:underline"
            >
              Mark all read
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`flex flex-col items-start cursor-pointer ${!n.is_read ? 'bg-muted/50' : ''}`}
              onClick={() => handleNotificationClick(n.id, n.data?.postId)}
            >
              <div className="text-sm font-medium">
                {n.type === 'new_comment' && `💬 ${n.data?.senderUsername} commented`}
                {n.type === 'new_like' && `❤️ ${n.data?.senderUsername} liked your post`}
                {n.type === 'new_follower' && `👤 ${n.data?.senderUsername} followed you`}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
