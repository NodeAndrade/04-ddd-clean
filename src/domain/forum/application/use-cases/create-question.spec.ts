import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let sut: CreateQuestionUseCase;

//sut = System Under Test

describe("Create Question Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository
    );
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to create a question", async () => {
    const result = await sut.execute({
      authorId: "instructor-id",
      title: "Question title",
      content: "question content",
      attachmentsIds: ["attachment-1", "attachment-2"],
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      result.value?.question
    );
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueValueID("attachment-1"),
      }),
      expect.objectContaining({
        attachmentId: new UniqueValueID("attachment-2"),
      }),
    ]);
  });

  it("should be able to create a question whitout any attachment", async () => {
    const result = await sut.execute({
      authorId: "instructor-id",
      title: "Question title",
      content: "question content",
    });
    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      result.value?.question
    );
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems
    ).toHaveLength(0);
  });
});
