import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";
import { Either, right } from "@/core/either";

interface ChooseQuestionBestAnswerUseCaseInterfaceRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseInterfaceResponse = Either<
  null,
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
      throw new Error("Answer not found.");
    }
    if (answer.authorId.toString() !== authorId) {
      throw new Error(
        "You can only choose the best answer for your own question."
      );
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString()
    );

    if (!question) {
      throw new Error("Question not found.");
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
