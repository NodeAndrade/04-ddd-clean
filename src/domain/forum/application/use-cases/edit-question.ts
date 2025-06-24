import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { NotAllowedError } from "./errors/not-allowed-error";
import { QuestionAttachmentRepository } from "../repositories/question-attachments-repository";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { UniqueValueID } from "@/core/entities/unique-value-id";

interface EditQuestionUseCaseInterfaceRequest {
  authorId: string;
  title: string;
  content: string;
  questionId: string;
  attachmentsIds?: string[];
}

type EditQuestionUseCaseInterfaceResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class EditQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionAttachmentRepository: QuestionAttachmentRepository
  ) {}

  async execute({
    authorId,
    title,
    content,
    questionId,
    attachmentsIds,
  }: EditQuestionUseCaseInterfaceRequest): Promise<EditQuestionUseCaseInterfaceResponse> {
    const question = await this.questionRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments
    );

    const questionAttachments = attachmentsIds?.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueValueID(attachmentId),
        questionId: question.id,
      });
    });

    questionAttachmentList.update(questionAttachments);

    question.title = title;
    question.content = content;
    question.attachments = questionAttachmentList;

    await this.questionRepository.edit(question);

    return right({
      question,
    });
  }
}
