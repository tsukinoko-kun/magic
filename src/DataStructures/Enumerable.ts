import { StringBuilder } from "./StringBuilder";

enum EnumerableType {
  where,
  orderBy,
  zip,
  select,
}

type EnumerableOptions<T> =
  | {
      type: EnumerableType.where;
      where: (item: T, index: number) => boolean;
    }
  | {
      type: EnumerableType.orderBy;
      compareFn: (a: T, b: T) => number;
    }
  | {
      type: EnumerableType.zip;
      resultSelector: (a: T, b: any) => any;
      second: Iterable<any>;
    }
  | {
      type: EnumerableType.select;
      selector: (item: T) => any;
    };

const defaultCompareFn = (a: any, b: any) => {
  if (a == b) {
    return 0;
  }
  return a < b ? -1 : 1;
};

export class Enumerable<T> {
  private readonly iter: Iterable<T>;
  private readonly options: EnumerableOptions<T> | undefined;

  private constructor(iterable: Iterable<T>, options?: EnumerableOptions<T>) {
    this.iter = iterable;
    this.options = options;
  }

  *[Symbol.iterator](): Iterator<T> {
    if (this.options) {
      switch (this.options.type) {
        case EnumerableType.where:
          let i = 0;
          for (const item of this.iter) {
            if (this.options.where(item, i)) {
              yield item;
            }
            i++;
          }
          break;

        case EnumerableType.orderBy:
          for (const item of Array.from(this.iter).sort(
            this.options.compareFn
          )) {
            yield item;
          }
          break;

        case EnumerableType.zip:
          const iterA = this.iter[Symbol.iterator]();
          const iterB = this.options.second[Symbol.iterator]();
          let a: IteratorResult<T>;
          let b: IteratorResult<any>;
          while (!(a = iterA.next()).done && !(b = iterB.next()).done) {
            yield this.options.resultSelector(a.value, b.value);
          }
          break;

        case EnumerableType.select:
          for (const item of this.iter) {
            yield this.options.selector(item);
          }
          break;
      }
    } else {
      for (const item of this.iter) {
        yield item;
      }
    }
  }

  /**
   * Create a new Enumerable<T> from an Iterable<T>
   */
  public static from<T>(iterable: Iterable<T>): Enumerable<T> {
    return new Enumerable(iterable);
  }

  /**
   * Creates an array from a Enumerable<T>.
   */
  public toArray(): Array<T> {
    return Array.from(this);
  }

  /**
   * Filters a sequence of values based on a predicate.
   * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
   */
  public where(predicate: (item: T, index: number) => boolean): Enumerable<T> {
    return new Enumerable(this, {
      type: EnumerableType.where,
      where: predicate,
    });
  }

  /**
   * Filters the elements of an Enumerable based on a specified type.
   */
  public ofType<TResult extends T>(
    TResult: new (...args: any[]) => TResult
  ): Enumerable<TResult> {
    return new Enumerable<any>(this, {
      type: EnumerableType.where,
      where: (item) => item instanceof TResult,
    });
  }

  /**
   * Sorts the elements of a sequence in ascending order according to a key.
   * @param keySelector A function to extract a key from an element.
   * @returns An Enumerable<T> whose elements are sorted according to a key.
   */
  public orderBy(compareFn?: (a: T, b: T) => number) {
    return new Enumerable(this, {
      type: EnumerableType.orderBy,
      compareFn: compareFn ?? defaultCompareFn,
    });
  }

  /**
   * Determines whether a sequence contains any elements.
   * @param predicate A function to test each element for a condition.
   */
  public any(predicate?: (item: T) => boolean): boolean {
    if (predicate) {
      for (const item of this) {
        if (predicate(item)) {
          return true;
        }
      }
    } else {
      for (const _ of this) {
        return true;
      }
    }

    return false;
  }

  /**
   * Creates a Map<TKey,TValue> from an Enumerable<T> according to specified key selector and element selector functions.
   * @param keySelector A function to extract a key from each element.
   * @param elementSelector A transform function to produce a result element value from each element.
   */
  public toMap<TKey, TValue>(
    keySelector: (item: T) => TKey,
    elementSelector: (item: T) => TValue
  ): Map<TKey, TValue> {
    const map = new Map<TKey, TValue>();
    for (const item of this) {
      map.set(keySelector(item), elementSelector(item));
    }
    return map;
  }

  /**
   * Creates a new Enumerable<T> by concatenating the source sequence with the sequence
   * @param selector A transform function to produce a result element value from each element.
   * @returns An Enumerable<T> whose elements are the result of invoking the transform function on each element of the source sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
   */
  public select<TResult>(selector: (item: T) => TResult): Enumerable<TResult> {
    return new Enumerable<any>(this, {
      type: EnumerableType.select,
      selector,
    });
  }

  /**
   * Creates a Set<T> from an Enumerable<T>.
   * @returns A Set<T> that contains values of type T selected from the input sequence.
   */
  public toSet(): Set<T> {
    const set = new Set<T>();
    for (const item of this) {
      set.add(item);
    }
    return set;
  }

  /**
   * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
   * @param second The second sequence to merge.
   * @param resultSelector A function that specifies how to merge the elements from the two sequences.
   * @returns An Enumerable<T> that contains merged elements of two input sequences.
   */
  public zip<TSecond, TResult>(
    second: Iterable<TSecond>,
    resultSelector: (a: T, b: TSecond) => TResult
  ): Enumerable<TResult> {
    return new Enumerable<any>(this, {
      type: EnumerableType.zip,
      resultSelector,
      second,
    });
  }

  public join(separator: string = ","): string {
    const sb = new StringBuilder();
    let first = true;
    for (const item of this) {
      if (!first) {
        sb.append(separator);
      } else {
        first = false;
      }

      sb.append(`${item}`);
    }

    return sb.toString();
  }
}
