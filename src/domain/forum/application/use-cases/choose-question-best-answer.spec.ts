import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/repositories/factories/make-question";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { makeAnswer } from "test/repositories/factories/make-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { NotAllowedError } from "./errors/not-allowed-error";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswersRepository: InMemoryAnswerRepository;
let sut: ChooseQuestionBestAnswerUseCase;

//sut = System Under Test

describe("Choose Question Best Answer Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    inMemoryAnswersRepository = new InMemoryAnswerRepository();
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository
    );
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
