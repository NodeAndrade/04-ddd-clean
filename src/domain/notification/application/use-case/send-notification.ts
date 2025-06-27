import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Either, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepository } from "../repositories/notification-repository";

interface SendNotifcationUseCaseInterfaceRequest {
  recipientId: string;
  title: string;
  content: string;
}

type SendNotifcationUseCaseInterfaceResponse = Either<
  null,
  {
    notification: Notification;
  }
>;

export class SendNotifcationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotifcationUseCaseInterfaceRequest): Promise<SendNotifcationUseCaseInterfaceResponse> {
    const notification = Notification.create({
      recipientId: new UniqueValueID(recipientId),
      title,
      content,
    });

    await this.notificationRepository.create(notification);

    return right({
      notification,
    });
  }
}
