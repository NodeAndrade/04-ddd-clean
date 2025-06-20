import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { makeAnswer } from "test/repositories/factories/make-answer";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { DeleteAnswerUseCase } from "./delete-answer";
import { UniqueValueID } from "@/core/entities/unique-value-id";

let inMemoryAnswersRepository: InMemoryAnswerRepository;
let sut: DeleteAnswerUseCase;

//sut = System Under Test

describe("Delete Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswerRepository();
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to delete a answer", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      answerId: newAnswer.id.toString(),
    });
    expect(inMemoryAnswersRepository.items).toHaveLength(0);
  });

  it("should not be able to delete a answer from another author", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryAnswersRepository.create(newAnswer);

    expect(() => {
      return sut.execute({
        authorId: new UniqueValueID("author-2").toString(),
        answerId: newAnswer.id.toString(),
      });
    }).rejects.toThrow("Not allowed to delete a answer from another author");
  });
});
