import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";

interface FetchRecentQuestionsUseCaseInterfaceRequest {
  page: number;
}

type FetchRecentQuestionsUseCaseInterfaceResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

export class FetchRecentQuestionsUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseInterfaceRequest): Promise<FetchRecentQuestionsUseCaseInterfaceResponse> {
    const questions = await this.questionRepository.findManyRecent({ page });

    return right({
      questions,
    });
  }
}
