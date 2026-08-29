export type NotificationType = "LOW_STOCK" | "OUT_OF_STOCK" | "ORDER_STATUS";

export type AppNotification = {
  id: number;
  type: NotificationType;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};
