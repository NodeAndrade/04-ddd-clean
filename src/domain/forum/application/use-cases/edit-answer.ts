import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answer-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentRepository } from "../repositories/answer-attachments-repository";

interface EditAnswerUseCaseInterfaceRequest {
  authorId: string;
  content: string;
  answerId: string;
  attachmentsIds?: string[];
}

type EditAnswerUseCaseInterfaceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer;
  }
>;

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerAttachmentsRepository: AnswerAttachmentRepository
  ) {}

  async execute({
    authorId,
    content,
    answerId,
    attachmentsIds,
  }: EditAnswerUseCaseInterfaceRequest): Promise<EditAnswerUseCaseInterfaceResponse> {
    const answer = await this.answerRepository.findById(answerId);
    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments
    );

    const answerAttachments = attachmentsIds?.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueValueID(attachmentId),
        answerId: answer.id,
      });
    });

    answerAttachmentList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.answerRepository.edit(answer);

    return right({
      answer,
    });
  }
}
