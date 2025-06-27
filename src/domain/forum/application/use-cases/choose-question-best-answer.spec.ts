import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/repositories/factories/make-question";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { makeAnswer } from "test/repositories/factories/make-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { MockInstance } from "vitest";
import { SendNotifcationUseCase } from "@/domain/notification/application/use-case/send-notification";
import { OnQuestionBestAnswerChosen } from "@/domain/notification/application/subscribers/on-question-best-answer-chosen";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswerRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sendNotifcationUseCase: SendNotifcationUseCase;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: ChooseQuestionBestAnswerUseCase;

let sendNotificationExecuteSpy: MockInstance;

//sut = System Under Test

describe("Choose Question Best Answer Use Case", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotifcationUseCase = new SendNotifcationUseCase(
      inMemoryNotificationRepository
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository
    );
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository
    );

    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotifcationUseCase
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotifcationUseCase, "execute");
  });

  it("should be able to choose a question best answer", async () => {
    const newQuestion = makeQuestion({});
    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
    });
    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(
      newAnswer.id
    );
    expect(sendNotificationExecuteSpy).toHaveBeenCalled();
  });

  it("should not be able to delete a question from another author", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryQuestionsRepository.create(newQuestion);

    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: new UniqueValueID("author-2").toString(),
      answerId: newAnswer.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
