import { NotificationRepository } from "@/domain/notification/application/repositories/notification-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationRepository implements NotificationRepository {
  public items: Notification[] = [];

  async findById(id: string) {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async create(notification: any): Promise<void> {
    this.items.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((item) => item.id === notification.id);
    if (index !== -1) {
      this.items[index] = notification;
    }
  }
}
