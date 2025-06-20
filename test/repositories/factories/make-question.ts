import { faker } from "@faker-js/faker";

import { UniqueValueID } from "@/core/entities/unique-value-id";
import {
  Question,
  QuestionProps,
} from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { title } from "process";

export function makeQuestion(
  overrides: Partial<QuestionProps> = {},
  id?: UniqueValueID
) {
  const question = Question.create(
    {
      authorId: new UniqueValueID(),
      title: faker.lorem.sentence(5),
      content: faker.lorem.paragraph(3),
      slug: Slug.create(title),
      ...overrides,
    },
    id
  );
  return question;
}
