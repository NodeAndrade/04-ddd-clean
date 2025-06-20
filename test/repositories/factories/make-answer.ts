import { faker } from "@faker-js/faker";

import { UniqueValueID } from "@/core/entities/unique-value-id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";

export function makeAnswer(
  overrides: Partial<AnswerProps> = {},
  id?: UniqueValueID
) {
  const answer = Answer.create(
    {
      questionId: new UniqueValueID(),
      authorId: new UniqueValueID(),
      content: faker.lorem.paragraph(3),
      ...overrides,
    },
    id
  );
  return answer;
}
