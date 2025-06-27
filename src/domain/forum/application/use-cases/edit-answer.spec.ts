import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { makeAnswer } from "test/repositories/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/repositories/factories/make-answer-attachments";

let inMemoryAnswersRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

//sut = System Under Test

describe("Edit Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentsRepository
    );
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryAnswersRepository.create(newAnswer);

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueValueID("attachment-1"),
      })
    );

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueValueID("attachment-2"),
      })
    );

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      content: "New Answer Content",
      answerId: newAnswer.id.toString(),
      attachmentsIds: ["attachment-1", "attachment-3"],
    });
    expect(inMemoryAnswersRepository.items[0].content).toEqual(
      "New Answer Content"
    );
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({
          attachmentId: new UniqueValueID("attachment-1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueValueID("attachment-3"),
        }),
      ]
    );
  });

  it("should not be able to edit a answer from another author", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.execute({
      authorId: new UniqueValueID("author-2").toString(),
      content: "New Answer Content",
      answerId: newAnswer.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
