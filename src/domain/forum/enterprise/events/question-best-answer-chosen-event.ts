import { UniqueValueID } from "@/core/entities/unique-value-id";
import { DomainEvents } from "@/core/events/domain-events";
import { Answer } from "../entities/answer";
import { Question } from "../entities/question";

export class QuestionBestAnswerChosenEvent implements DomainEvents {
  public ocurredAt: Date;
  public question: Question;
  public bestAnswerId: UniqueValueID;

  constructor(question: Question, bestAnswerId: UniqueValueID) {
    this.question = question;
    this.bestAnswerId = bestAnswerId;
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueValueID {
    return this.question.id;
  }
}
