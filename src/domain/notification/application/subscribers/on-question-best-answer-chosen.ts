import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { SendNotifcationUseCase } from "../use-case/send-notification";
import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswerRepository,
    private sendNotification: SendNotifcationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    );
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(
      bestAnswerId.toString()
    );
    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta foi escolhida`,
        content: `A resposta que você enviou em "${question.title.substring(
          0,
          20
        )}" foi escolhida pelo autor`,
      });
    }
  }
}
