import type { Collection } from "./Collection";
import type {
  Callback,
  FilterNestedKeys,
  GetNestedKeys,
  Nullable,
  OptionalReturn
} from "./types";
import { RecordCollection } from "./RecordCollection";
import { arrayToRecord, getNestedValue, resolveKey } from "./utils";

type NestedKeys<T> = FilterNestedKeys<GetNestedKeys<T>>;

export class ArrayCollection<V> implements Collection<V> {
  constructor(private readonly values: V[]) {}

  keyBy(
    keyOrCallback: NestedKeys<V> | Callback<string | number, [V]>
  ): Collection<V> {
    const result = {} as Record<string, V>;

    this.values.forEach((value, key) => {
      result[resolveKey(key, value, keyOrCallback)] = value;
    });

    return new RecordCollection(result);
  }

  groupBy(
    keyOrCallback: NestedKeys<V> | Callback<string | number, [V]>
  ): Collection<V[]> {
    const result = {} as Record<string, V[]>;

    this.values.forEach((value, key) => {
      const resolvedKey = resolveKey(key, value, keyOrCallback);

      if (!result[resolvedKey]) {
        result[resolvedKey] = [];
      }

      result[resolvedKey].push(value);
    });

    return new RecordCollection(result);
  }

  each(
    callback: Callback<OptionalReturn<boolean>, [V, string | number]>
  ): Collection<V> {
    const length = this.values.length;

    for (let key = 0; key < length; key++) {
      if (callback(this.values[key], key) === false) {
        break;
      }
    }

    return this;
  }

  map<T>(
    keyOrCallback: NestedKeys<V> | Callback<T, [V, string | number]>
  ): Collection<T> {
    return new ArrayCollection(
      this.values.map((value, key): T => {
        return typeof keyOrCallback === "function"
          ? keyOrCallback(value, key)
          : (getNestedValue(value, keyOrCallback) as T);
      })
    );
  }

  filter(callback: Callback<boolean, [V, string | number]>): Collection<V> {
    return new ArrayCollection(
      this.values.filter((value, key) => callback(value, key))
    );
  }

  get(key: string | number, defaultValue: Nullable<V> = null): Nullable<V> {
    if (typeof key === "string") {
      return defaultValue;
    }

    const value = this.values[key] as never;

    return !value ? defaultValue : value;
  }

  set(key: string | number, value: V): Collection<V> {
    if (typeof key === "string") {
      return new RecordCollection(arrayToRecord(this.values)).set(key, value);
    }

    const values = [...this.values];

    values[key] = value;

    return new ArrayCollection(values);
  }

  delete(key: string | number): Collection<V> {
    if (typeof key === "string") {
      return new RecordCollection(arrayToRecord(this.values)).delete(key);
    }

    const values = [...this.values];

    values.splice(key, 1);

    return new ArrayCollection(values);
  }

  pluck<T>(key: NestedKeys<V>): Collection<T> {
    return new ArrayCollection(
      this.values.map((value): T => {
        return getNestedValue(value, key) as T;
      })
    );
  }

  toArray(): V[] {
    return this.values.splice(0);
  }
}
