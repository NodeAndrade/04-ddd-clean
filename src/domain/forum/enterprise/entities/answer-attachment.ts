import { Entity } from "@/core/entities/entity";
import { UniqueValueID } from "@/core/entities/unique-value-id";

export interface AnswerAttachmentProps {
  answerId: UniqueValueID;
  attachmentId: UniqueValueID;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId() {
    return this.props.answerId;
  }

  get attachmentId() {
    return this.props.attachmentId;
  }

  static create(props: AnswerAttachmentProps, id?: UniqueValueID) {
    const attachment = new AnswerAttachment(props, id);
    return attachment;
  }
}
