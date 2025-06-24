import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/repositories/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryQuestionsAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { makeQuestionAttachment } from "test/repositories/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionsAttachmentsRepository;
let sut: EditQuestionUseCase;

//sut = System Under Test

describe("Edit Question Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionsAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository
    );
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsAttachmentsRepository
    );
  });

  it("should be able to edit a question", async () => {
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
      title: "New Question Title",
      content: "New Question Content",
      questionId: newQuestion.id.toString(),
      attachmentsIds: ["attachment-1", "attachment-3"],
    });
    expect(inMemoryQuestionsRepository.items[0].title).toEqual(
      "New Question Title"
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
        attachmentId: new UniqueValueID("attachment-3"),
      }),
    ]);
  });

  it("should not be able to edit a question from another author", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: new UniqueValueID("author-2").toString(),
      title: "New Question Title",
      content: "New Question Content",
      questionId: newQuestion.id.toString(),
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
