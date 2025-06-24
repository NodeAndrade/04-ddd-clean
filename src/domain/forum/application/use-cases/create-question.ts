import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionRepository } from "../repositories/question-repository";
import { Either, right } from "@/core/either";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list";

interface CreateQuestionUseCaseInterfaceRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds?: string[];
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
    attachmentsIds,
  }: CreateQuestionUseCaseInterfaceRequest): Promise<CreateQuestionUseCaseInterfaceResponse> {
    const question = Question.create({
      authorId: new UniqueValueID(authorId),
      title,
      content,
    });

    const questionAttachments = attachmentsIds?.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueValueID(attachmentId),
        questionId: question.id,
      });
    });

    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.questionRepository.create(question);

    return right({
      question,
    });
  }
}
