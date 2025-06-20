import { Either, left, right } from "./either";

function doSomething(shoudSucess: boolean): Either<string, number> {
  if (shoudSucess) {
    return right(10);
  } else {
    return left("Error");
  }
}

test("Sucess result", () => {
  const result = doSomething(true);

  expect(result.isRight()).toBe(true);
  expect(result.isLeft()).toBe(false);
});

test("Error result", () => {
  const result = doSomething(false);

  expect(result.isRight()).toBe(false);
  expect(result.isLeft()).toBe(true);
  expect(result.value).toBe("Error");
});
