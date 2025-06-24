import { UniqueValueID } from "@/core/entities/unique-value-id";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionRepository {
  public items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentRepository
  ) {}

  async findById(id: string) {
    return this.items.find((item) => item.id.toString() === id) || null;
  }
  async create(question: any): Promise<void> {
    this.items.push(question);
  }

  async findBySlug(slug: string) {
    return this.items.find((item) => item.slug.value === slug) || null;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items.splice(itemIndex, 1);

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }

  async edit(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id);

    this.items[itemIndex] = question;
  }

  async chooseBestAnswer(questionId: string, bestAnswerId: string) {
    const question = await this.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    question.bestAnswerId = new UniqueValueID(bestAnswerId);

    const itemIndex = this.items.findIndex((item) => item.id === question.id);
    this.items[itemIndex] = question;
  }
}
