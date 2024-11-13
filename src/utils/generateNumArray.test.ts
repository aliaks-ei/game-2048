import { generateNumArray } from "./generateNumArray";

describe("generateNumArray", () => {
  test("should generate an array of numbers from 0 to length - 1", () => {
    const length = 5;
    const result = generateNumArray(length);

    expect(result).toEqual([0, 1, 2, 3, 4]);
  });

  test("should generate an empty array if length is 0", () => {
    const length = 0;
    const result = generateNumArray(length);

    expect(result).toEqual([]);
  });
});
