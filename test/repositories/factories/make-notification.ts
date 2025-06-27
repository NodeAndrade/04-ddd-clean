import { faker } from "@faker-js/faker";

import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import {
  Notification,
  NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";

export function makeNotification(
  overrides: Partial<NotificationProps> = {},
  id?: UniqueValueID
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueValueID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(3),
      ...overrides,
    },
    id
  );
  return notification;
}
