import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionsAttachmentsRepository
  implements QuestionAttachmentRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(id: string): Promise<QuestionAttachment[]> {
    return this.items.filter((item) => item.questionId.toString() === id);
  }

  async deleteManyByQuestionId(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.questionId.toString() !== id);
  }
}
