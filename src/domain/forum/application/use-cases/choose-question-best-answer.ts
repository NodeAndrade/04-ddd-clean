import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";

interface ChooseQuestionBestAnswerUseCaseInterfaceRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseInterfaceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private answerRepository: AnswerRepository
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseInterfaceRequest): Promise<ChooseQuestionBestAnswerUseCaseInterfaceResponse> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString()
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    await this.questionRepository.chooseBestAnswer(
      question.id.toString(),
      answer.id.toString()
    );

    return right({
      question,
    });
  }
}
