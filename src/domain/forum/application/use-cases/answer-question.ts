import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";
import { Either, right } from "@/core/either";

interface AnswerQuestionUseCaseInterfaceRequest {
  instructorId: string;
  questionId: string;
  content: string;
}

type AnswerQuestionUseCaseInterfaceResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseInterfaceRequest): Promise<AnswerQuestionUseCaseInterfaceResponse> {
    const answer = Answer.create({
      content,
      questionId: new UniqueValueID(questionId),
      authorId: new UniqueValueID(instructorId),
    });

    await this.answerRepository.create(answer);

    return right({
      answer,
    });
  }
}
