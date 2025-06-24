import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { makeAnswer } from "test/repositories/factories/make-answer";
import { DeleteAnswerUseCase } from "./delete-answer";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { NotAllowedError } from "./errors/not-allowed-error";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { makeAnswerAttachment } from "test/repositories/factories/make-answer-attachments";

let inMemoryAnswersRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

//sut = System Under Test

describe("Delete Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to delete a answer", async () => {
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
      answerId: newAnswer.id.toString(),
    });
    expect(inMemoryAnswersRepository.items).toHaveLength(0);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another author", async () => {
    const newAnswer = makeAnswer({
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
