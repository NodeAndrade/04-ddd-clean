import { Entity } from "@/core/entities/entity";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Optional } from "@/core/types/optional";

export interface NotificationProps {
  recipientId: UniqueValueID;
  title: string;
  content: string;
  readAt?: Date;
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content;
  }

  get readAt() {
    return this.props.readAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  read() {
    this.props.readAt = new Date();
  }

  static create(
    props: Optional<NotificationProps, "createdAt">,
    id?: UniqueValueID
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    return notification;
  }
}
