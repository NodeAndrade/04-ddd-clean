import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { makeQuestion } from "test/repositories/factories/make-question";
import { FetchQuestionAnswersUseCase } from "./fetch-questions-answer";
import { makeAnswer } from "test/repositories/factories/make-answer";
import { UniqueValueID } from "@/core/entities/unique-value-id";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let sut: FetchQuestionAnswersUseCase;

//sut = System Under Test

describe("Fetch Questions Answers Use Case", () => {
  beforeEach(() => {
    inMemoryAnswerRepository = new InMemoryAnswerRepository();
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository);
  });

  it("should be able to fetch recent answers", async () => {
    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId: new UniqueValueID("question-1"),
      })
    );
    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId: new UniqueValueID("question-1"),
      })
    );
    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId: new UniqueValueID("question-1"),
      })
    );

    const { answers } = await sut.execute({
      questionId: "question-1",
      page: 1,
    });

    expect(answers).toHaveLength(3);
  });

  it("should be able to fetch paginated recent questions", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswer({
          questionId: new UniqueValueID(`question-1`),
        })
      );
    }

    const { answers } = await sut.execute({
      questionId: "question-1",
      page: 2,
    });

    expect(answers).toHaveLength(2);
  });
});
