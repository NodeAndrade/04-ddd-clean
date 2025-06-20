import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { makeAnswer } from "test/repositories/factories/make-answer";
import { EditAnswerUseCase } from "./edit-answer";
import { UniqueValueID } from "@/core/entities/unique-value-id";

let inMemoryAnswersRepository: InMemoryAnswerRepository;
let sut: EditAnswerUseCase;

//sut = System Under Test

describe("Edit Answer Use Case", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswerRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      authorId: newAnswer.authorId.toString(),
      content: "New Answer Content",
      answerId: newAnswer.id.toString(),
    });
    expect(inMemoryAnswersRepository.items[0].content).toEqual(
      "New Answer Content"
    );
  });

  it("should not be able to edit a answer from another author", async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryAnswersRepository.create(newAnswer);

    expect(() => {
      return sut.execute({
        authorId: new UniqueValueID("author-2").toString(),
        content: "New Answer Content",
        answerId: newAnswer.id.toString(),
      });
    }).rejects.toThrow("Not allowed to edit a answer from another author");
  });
});
