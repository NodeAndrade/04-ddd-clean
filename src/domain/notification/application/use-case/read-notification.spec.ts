import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { ReadNotifcationUseCase } from "./read-notification";
import { makeNotification } from "test/repositories/factories/make-notification";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ReadNotifcationUseCase;

//sut = System Under Test

describe("Read Notification Use Case", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new ReadNotifcationUseCase(inMemoryNotificationRepository);
  });

  it("should be able to send a notification", async () => {
    const notification = makeNotification({
      recipientId: new UniqueValueID("recipient-id"),
      title: "Notification title",
      content: "Notification content",
    });

    await inMemoryNotificationRepository.create(notification);

    const result = await sut.execute({
      recipientId: "recipient-id",
      notificationId: notification.id.toString(),
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date)
    );
  });
});
