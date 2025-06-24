import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerRepository } from "@/domain/forum/application/repositories/answer-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswerRepository implements AnswerRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentRepository
  ) {}

  async findById(id: string) {
    return this.items.find((item) => item.id.toString() === id) || null;
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    const filteredItems = this.items.filter(
      (item) => item.questionId.toString() === questionId
    );

    const { page } = params;
    const start = (page - 1) * 20;
    const end = start + 20;

    return filteredItems.slice(start, end);
  }

  async create(answer: any): Promise<void> {
    this.items.push(answer);
  }
  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items.splice(itemIndex, 1);

    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString());
  }
  async edit(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id);

    this.items[itemIndex] = answer;
  }
}
