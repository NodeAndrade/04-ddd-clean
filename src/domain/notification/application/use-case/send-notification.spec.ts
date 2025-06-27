import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { SendNotifcationUseCase } from "./send-notification";

let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: SendNotifcationUseCase;

//sut = System Under Test

describe("Send Notification Use Case", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sut = new SendNotifcationUseCase(inMemoryNotificationRepository);
  });

  it("should be able to send a notification", async () => {
    const result = await sut.execute({
      recipientId: "recipient-id",
      title: "Notification title",
      content: "notification content",
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationRepository.items[0]).toEqual(
      result.value?.notification
    );
  });
});
