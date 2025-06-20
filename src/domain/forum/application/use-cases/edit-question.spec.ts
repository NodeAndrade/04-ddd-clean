import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/repositories/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { EditQuestionUseCase } from "./edit-question";
import { UniqueValueID } from "@/core/entities/unique-value-id";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

//sut = System Under Test

describe("Edit Question Use Case", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create("question-title"),
    });
    await inMemoryQuestionsRepository.create(newQuestion);

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      title: "New Question Title",
      content: "New Question Content",
      questionId: newQuestion.id.toString(),
    });
    expect(inMemoryQuestionsRepository.items[0].title).toEqual(
      "New Question Title"
    );
  });

  it("should not be able to edit a question from another author", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueValueID("author-1"),
    });
    await inMemoryQuestionsRepository.create(newQuestion);

    expect(() => {
      return sut.execute({
        authorId: new UniqueValueID("author-2").toString(),
        title: "New Question Title",
        content: "New Question Content",
        questionId: newQuestion.id.toString(),
      });
    }).rejects.toThrow("Not allowed to edit a question from another author");
  });
});
