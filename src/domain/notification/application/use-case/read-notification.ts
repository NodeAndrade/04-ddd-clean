import { Either, left, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationRepository } from "../repositories/notification-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface ReadNotifcationUseCaseInterfaceRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotifcationUseCaseInterfaceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification;
  }
>;

export class ReadNotifcationUseCase {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotifcationUseCaseInterfaceRequest): Promise<ReadNotifcationUseCaseInterfaceResponse> {
    const notification = await this.notificationRepository.findById(
      notificationId
    );

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }

    notification.read();
    await this.notificationRepository.save(notification);

    return right({
      notification,
    });
  }
}
