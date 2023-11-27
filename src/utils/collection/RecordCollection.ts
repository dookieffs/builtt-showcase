import { ArrayCollection } from "./ArrayCollection";
import type { Collection } from "./Collection";
import type {
  Callback,
  FilterNestedKeys,
  GetNestedKeys,
  Nullable,
  OptionalReturn
} from "./types";
import { getNestedValue, resolveKey } from "./utils";

type NestedKeys<T> = FilterNestedKeys<GetNestedKeys<T>>;

export class RecordCollection<V> implements Collection<V> {
  constructor(private readonly values: Record<string | number, V>) {}

  keyBy(keyBy: NestedKeys<V> | Callback<string | number, [V]>): Collection<V> {
    const result = {} as Record<string | number, V>;

    Object.keys(this.values).forEach((key) => {
      const value = this.values[key];

      result[resolveKey(key, value, keyBy)] = value;
    });

    return new RecordCollection(result);
  }

  groupBy(
    groupBy: NestedKeys<V> | Callback<string | number, [V]>
  ): Collection<V[]> {
    const result = {} as Record<string, V[]>;

    Object.keys(this.values).forEach((key) => {
      const value = this.values[key];
      const resolvedKey = resolveKey(key, value, groupBy);

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
    const keys = Object.keys(this.values);
    const length = keys.length;

    for (let index = 0; index < length; index++) {
      const key = keys[index];

      if (callback(this.values[key], key) === false) {
        break;
      }
    }

    return this;
  }

  map<T>(
    keyOrCallback: NestedKeys<V> | Callback<T, [V, string | number]>
  ): Collection<T> {
    const result = {} as Record<string | number, T>;

    Object.keys(this.values).forEach((key) => {
      const value = this.values[key];

      result[key] =
        typeof keyOrCallback === "function"
          ? keyOrCallback(value, key)
          : (getNestedValue(value, keyOrCallback) as T);
    });

    return new RecordCollection(result);
  }

  filter(callback: Callback<boolean, [V, string | number]>): Collection<V> {
    const result = {} as Record<string | number, V>;

    Object.keys(this.values).forEach((key) => {
      const value = this.values[key];

      if (!callback(value, key)) {
        return;
      }

      result[key] = value;
    });

    return new RecordCollection(result);
  }

  get(key: string | number, defaultValue: Nullable<V> = null): Nullable<V> {
    const value = this.values[key] as never;

    return !value ? defaultValue : value;
  }

  set(key: string | number, value: V): Collection<V> {
    const values = { ...this.values };

    values[key] = value;

    return new RecordCollection(values);
  }

  delete(key: string | number): Collection<V> {
    const values = { ...this.values };

    delete values[key];

    return new RecordCollection(values);
  }

  pluck<T>(key: NestedKeys<V>): Collection<T> {
    return new ArrayCollection(
      Object.keys(this.values).map((innerKey) => {
        const value = this.values[innerKey];

        return getNestedValue(value, key) as T;
      })
    );
  }

  toArray(): V[] {
    return Object.keys(this.values).map((key) => this.values[key]);
  }
}
