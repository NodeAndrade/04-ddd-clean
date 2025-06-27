import { UniqueValueID } from "@/core/entities/unique-value-id";
import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { OnAnswerCreated } from "@/domain/notification/application/subscribers/on-answer-created";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { SendNotifcationUseCase } from "@/domain/notification/application/use-case/send-notification";
import { InMemoryNotificationRepository } from "test/repositories/in-memory-notification-repository";
import { makeQuestion } from "test/repositories/factories/make-question";
import { MockInstance } from "vitest";

let inMemoryQuestionsAttachmentRepository: InMemoryQuestionsAttachmentsRepository;
let inMemoryQuestionRepository: InMemoryQuestionsRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository;
let sendNotifcationUseCase: SendNotifcationUseCase;
let inMemoryNotificationRepository: InMemoryNotificationRepository;
let sut: AnswerQuestionUseCase;

let sendNotificationExecuteSpy: MockInstance;

//sut = System Under Test

describe("Create Answer Use Case", () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationRepository();
    sendNotifcationUseCase = new SendNotifcationUseCase(
      inMemoryNotificationRepository
    );
    inMemoryQuestionsAttachmentRepository =
      new InMemoryQuestionsAttachmentsRepository();
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentRepository
    );
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository);

    sendNotificationExecuteSpy = vi.spyOn(sendNotifcationUseCase, "execute");
    new OnAnswerCreated(inMemoryQuestionRepository, sendNotifcationUseCase);
  });

  it("should be able to create an answer", async () => {
    const question = makeQuestion();
    inMemoryQuestionRepository.create(question);

    const result = await sut.execute({
      instructorId: "instructor-id",
      questionId: question.id.toString(),
      content: "answer content",
      attachmentsIds: ["attachment-1", "attachment-2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswerRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueValueID("attachment-1"),
      }),
      expect.objectContaining({
        attachmentId: new UniqueValueID("attachment-2"),
      }),
    ]);
    expect(sendNotificationExecuteSpy).toHaveBeenCalled();
  });
});
