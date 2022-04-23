const Enumerable = require("../").Enumerable;

test("Enumerable.where", () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const result = Enumerable.from(arr)
    .where((x) => x % 2 === 0)
    .toArray();
  expect(result).toEqual([2, 4, 6, 8, 10]);
});

test("Enumerable.orderBy", () => {
  const arr = [4, 3, 6, 5, 1, 2, 0, 7, 8, 9, 10];
  const result = Enumerable.from(arr)
    .orderBy((a, b) => a - b)
    .toArray();
  expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("Enumerable.join", () => {
  const arr = [4, 3, 6, 5, 1, 2, 0, 7, 8, 9, 10];
  const result = Enumerable.from(arr).orderBy((a, b) => a - b);

  expect(result.join()).toBe([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].join());
  expect(result.join(";")).toBe([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].join(";"));
});

test("Enumerable.zip", () => {
  const arr1 = [1, 2, 3];
  const arr2 = ["apple", "banana", "orange"];
  const result = Enumerable.from(arr1)
    .zip(arr2, (a, b) => `${a}: ${b}`)
    .toArray();

  expect(result).toEqual(["1: apple", "2: banana", "3: orange"]);
});

test("Enumerable.select", () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const result = Enumerable.from(arr)
    .select((x) => x * 2)
    .select(String)
    .toArray();

  expect(result).toEqual([
    "2",
    "4",
    "6",
    "8",
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
  ]);
});
