import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";
import { Either, right } from "@/core/either";

interface CreateQuestionUseCaseInterfaceRequest {
  authorId: string;
  title: string;
  content: string;
}

type CreateQuestionUseCaseInterfaceResponse = Either<
  null,
  {
    question: Question;
  }
>;

export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseInterfaceRequest): Promise<CreateQuestionUseCaseInterfaceResponse> {
    const question = Question.create({
      authorId: new UniqueValueID(authorId),
      title,
      content,
    });
    await this.questionRepository.create(question);

    return right({
      question,
    });
  }
}
