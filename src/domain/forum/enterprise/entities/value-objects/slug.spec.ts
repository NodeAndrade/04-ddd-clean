import { Slug } from "./slug";

test("it shloud be able to create a slug", () => {
  const slug = Slug.createFromText("Example question title");
  expect(slug.value).toEqual("example-question-title");
});
