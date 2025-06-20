import { Either, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";

interface FetchQuestionAnswersUseCaseInterfaceRequest {
  questionId: string;
  page: number;
}

type FetchQuestionAnswersUseCaseInterfaceResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersUseCaseInterfaceRequest): Promise<FetchQuestionAnswersUseCaseInterfaceResponse> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page }
    );
    return right({
      answers,
    });
  }
}
