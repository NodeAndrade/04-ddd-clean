import { UniqueValueID } from "@/core/entities/unique-value-id";
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";

export function makeAnswerAttachment(
  overrides: Partial<AnswerAttachmentProps> = {},
  id?: UniqueValueID
) {
  const answer = AnswerAttachment.create(
    {
      answerId: new UniqueValueID(),
      attachmentId: new UniqueValueID(),
      ...overrides,
    },
    id
  );
  return answer;
}
