import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { SendNotifcationUseCase } from "../use-case/send-notification";

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionRepository,
    private sendNotification: SendNotifcationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    );

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta na pergunta "${question?.title.substring(
          0,
          20
        )}..."`,
        content: answer.excerpt,
      });
    }
  }
}
