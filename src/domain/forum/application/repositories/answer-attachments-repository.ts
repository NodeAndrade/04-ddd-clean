import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";

export interface AnswerAttachmentRepository {
  findManyByAnswerId(id: string): Promise<AnswerAttachment[]>;
  deleteManyByAnswerId(answerId: string): Promise<void>;
}
