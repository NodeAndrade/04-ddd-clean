import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentRepository
{
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(id: string): Promise<AnswerAttachment[]> {
    return this.items.filter((item) => item.answerId.toString() === id);
  }

  async deleteManyByAnswerId(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.answerId.toString() !== id);
  }
}
