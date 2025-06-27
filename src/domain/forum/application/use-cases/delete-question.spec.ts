import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/repositories/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/repositories/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let sut: DeleteQuestionUseCase;

//sut = System Under Test

describe("Delete Question Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to delete a question", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("question-title"),
    });
    await inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionsAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueValueID("attachment-1"),
      })
    );

    inMemoryQuestionsAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueValueID("attachment-2"),
      })
    );

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
    });
    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionsAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a question from another author", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: new UniqueValueID("author-2").toString(),
      questionId: newQuestion.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
