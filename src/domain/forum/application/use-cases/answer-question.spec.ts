import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
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
    const { answer } = await sut.execute({
      instructorId: "instructor-id",
      questionId: "question-id",
      content: "answer content",
    });
    expect(answer.id).toBeTruthy();
    expect(inMemoryAnswerRepository.items[0].id).toEqual(answer.id);
  });
});
