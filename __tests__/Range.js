const range = require("../").range;

test("range default no step size", () => {
  const r = Array.from(range(3, 8));
  const arr = [3, 4, 5, 6, 7, 8];

  expect(r.length === arr.length).toBeTruthy();

  for (let i = 0; i < r.length; i++) {
    expect(r[i]).toBeCloseTo(r[i]);
  }
});

test("range default with step size", () => {
  const r = Array.from(range(1.75, 3, 0.25));
  const arr = [1.75, 2, 2.25, 2.5, 2.75, 3];

  expect(r.length === arr.length).toBeTruthy();

  for (let i = 0; i < r.length; i++) {
    expect(r[i]).toBeCloseTo(r[i]);
  }
});

test("range inverted no step size", () => {
  const r = Array.from(range(4, 2));
  const arr = [4, 3, 2];

  expect(r.length === arr.length).toBeTruthy();

  for (let i = 0; i < r.length; i++) {
    expect(r[i]).toBeCloseTo(r[i]);
  }
});

test("range inverted with negative step size", () => {
  const r = Array.from(range(5, 0, -2));
  const arr = [5, 3, 1];

  expect(r.length === arr.length).toBeTruthy();

  for (let i = 0; i < r.length; i++) {
    expect(r[i]).toBeCloseTo(r[i]);
  }
});

test("range auto inverted", () => {
  const r = Array.from(range(5, 2, 2));
  const arr = [5, 3];

  expect(r.length === arr.length).toBeTruthy();

  for (let i = 0; i < r.length; i++) {
    expect(r[i]).toBeCloseTo(r[i]);
  }
});

test("range for loop", () => {
  const arr = [3, 4, 5, 6, 7, 8];
  for (const i of range(3, 8)) {
    const j = arr.shift();
    if (j) {
      expect(i).toBeCloseTo(j);
    } else {
      expect(j).toBeDefined();
    }
  }
});
