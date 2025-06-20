import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { makeQuestion } from "test/repositories/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

//sut = System Under Test

describe("Get Question By Slug Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by it's slug", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("question-title"),
    });
    await inMemoryQuestionsRepository.create(newQuestion);

    const { question } = await sut.execute({
      slug: "question-title",
    });
    expect(question.id).toBeTruthy();
    expect(question.title).toEqual(newQuestion.title);
  });
});
