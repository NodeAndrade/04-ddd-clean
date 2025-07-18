import { PaginationParams } from "@/core/repositories/pagination-params";
import { Question } from "../../enterprise/entities/question";

export interface QuestionRepository {
  findById(id: string): Promise<Question | null>;
  findBySlug(slug: string): Promise<Question | null>;
  findManyRecent(params: PaginationParams): Promise<Question[]>;
  create: (question: Question) => Promise<void>;
  delete: (question: Question) => Promise<void>;
  edit: (question: Question) => Promise<void>;
  chooseBestAnswer: (questionId: string, bestAnswerId: string) => Promise<void>;
}
