import { UniqueValueID } from "@/core/entities/unique-value-id";
import { DomainEvents } from "@/core/events/domain-events";
import { Answer } from "../entities/answer";

export class AnswerCreatedEvent implements DomainEvents {
  public ocurredAt: Date;
  public answer: Answer;
  constructor(answer: Answer) {
    this.answer = answer;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueValueID {
    return this.answer.id;
  }
}
