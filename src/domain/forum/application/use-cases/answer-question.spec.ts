import { UniqueValueID } from "@/core/entities/unique-value-id";
import { AnswerQuestionUseCase } from "./answer-question";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: AnswerQuestionUseCase;

//sut = System Under Test

describe("Create Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new AnswerQuestionUseCase(inMemoryAnswerRepository);
  });

  it("should be able to create an answer", async () => {
    const result = await sut.execute({
      instructorId: "instructor-id",
      questionId: "question-id",
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
  });
});
