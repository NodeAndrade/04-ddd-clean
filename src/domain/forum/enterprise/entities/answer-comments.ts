import { Entity } from "@/core/entities/entity";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Optional } from "@/core/types/optional";

export interface AnswerCommentProps {
  authorId: UniqueValueID;
  answerId: UniqueValueID;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class AnswerComment extends Entity<AnswerCommentProps> {
  get authorId() {
    return this.props.authorId;
  }
  get content() {
    return this.props.content;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat("...");
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  static create(
    props: Optional<AnswerCommentProps, "createdAt">,
    id?: UniqueValueID
  ) {
    const answerComment = new AnswerComment({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
    return answerComment;
  }
}
