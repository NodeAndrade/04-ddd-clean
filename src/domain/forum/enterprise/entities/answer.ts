import { Entity } from "@/core/entities/entity";
import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Optional } from "@/core/types/optional";
import { AnswerAttachmentList } from "./answer-attachment-list";

export interface AnswerProps {
  questionId: UniqueValueID;
  authorId: UniqueValueID;
  content: string;
  createdAt: Date;
  attachments: AnswerAttachmentList;
  updatedAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
  get questionId() {
    return this.props.questionId;
  }
  get authorId() {
    return this.props.authorId;
  }
  get content() {
    return this.props.content;
  }
  get attachments() {
    return this.props.attachments;
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

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  static create(
    props: Optional<AnswerProps, "createdAt" | "attachments">,
    id?: UniqueValueID
  ) {
    const answer = new Answer({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      attachments: props.attachments ?? new AnswerAttachmentList(),
    });
    return answer;
  }
}
