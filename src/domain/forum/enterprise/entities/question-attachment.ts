import { Entity } from "@/core/entities/entity";
import { UniqueValueID } from "@/core/entities/unique-value-id";

export interface QuestionAttachmentProps {
  questionId: UniqueValueID;
  attachmentId: UniqueValueID;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get questionId() {
    return this.props.questionId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: QuestionAttachmentProps, id?: UniqueValueID) {
    const attachment = new QuestionAttachment(props, id);
    return attachment;
  }
}
