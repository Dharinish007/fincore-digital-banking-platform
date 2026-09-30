import { db } from '../db.js';
import { Notification, NotificationType, NotificationChannel } from '../../src/types/index.js';

export class NotificationService {
  public static send(params: {
    userId?: string;
    customerId?: string;
    transactionId?: string;
    sagaId?: string;
    type: NotificationType;
    title: string;
    message: string;
    channel?: NotificationChannel;
  }): Notification {
    const state = db.getState();
    const id = `NOTIF-${String(state.notifications.length + 1).padStart(4, '0')}`;
    const channel = params.channel || 'IN_APP';

    const notif: Notification = {
      id,
      userId: params.userId,
      customerId: params.customerId,
      transactionId: params.transactionId,
      sagaId: params.sagaId,
      type: params.type,
      title: params.title,
      message: params.message,
      channel,
      status: channel === 'IN_APP' ? 'DELIVERED' : 'SENT',
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    state.notifications.unshift(notif);
    return notif;
  }
}
