import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";
import { Either, right } from "@/core/either";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

interface AnswerQuestionUseCaseInterfaceRequest {
  instructorId: string;
  questionId: string;
  attachmentsIds?: string[];
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
    attachmentsIds,
  }: AnswerQuestionUseCaseInterfaceRequest): Promise<AnswerQuestionUseCaseInterfaceResponse> {
    const answer = Answer.create({
      content,
      questionId: new UniqueValueID(questionId),
      authorId: new UniqueValueID(instructorId),
    });

    const answerAttachments = attachmentsIds?.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueValueID(attachmentId),
        answerId: answer.id,
      });
    });

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answerRepository.create(answer);

    return right({
      answer,
    });
  }
}
