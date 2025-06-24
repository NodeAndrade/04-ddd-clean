import { UniqueValueID } from "@/core/entities/unique-value-id";
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";

export function makeQuestionAttachment(
  overrides: Partial<QuestionAttachmentProps> = {},
  id?: UniqueValueID
) {
  const question = QuestionAttachment.create(
    {
      questionId: new UniqueValueID(),
      attachmentId: new UniqueValueID(),
      ...overrides,
    },
    id
  );
  return question;
}
