export function* range(start: number, end: number, step: number = 1) {
  let iterationCount = 0;
  if (start < end && step > 0) {
    for (let i = start; i <= end; i += step) {
      iterationCount++;
      yield i;
    }
  } else if (start > end) {
    if (step < 0) {
      for (let i = start; i >= end; i += step) {
        iterationCount++;
        yield i;
      }
    } else {
      for (let i = start; i >= end; i -= step) {
        iterationCount++;
        yield i;
      }
    }
  } else {
    throw new Error(
      "ArgumentException\nThis exception is thrown when one of the arguments provided to a method is not valid."
    );
  }
  return iterationCount;
}
