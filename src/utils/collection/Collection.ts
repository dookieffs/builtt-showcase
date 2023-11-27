import type {
  Callback,
  FilterNestedKeys,
  GetNestedKeys,
  Nullable,
  OptionalReturn
} from "./types";

type NestedKeys<T> = FilterNestedKeys<GetNestedKeys<T>>;

export interface Collection<V> {
  keyBy(
    keyOrCallback: NestedKeys<V> | Callback<string | number, [V]>
  ): Collection<V>;

  groupBy(
    keyOrCallback: NestedKeys<V> | Callback<string | number, [V]>
  ): Collection<V[]>;

  each(
    callback: Callback<OptionalReturn<boolean>, [V, string | number]>
  ): Collection<V>;

  map<T>(
    keyOrCallback: NestedKeys<V> | Callback<T, [V, string | number]>
  ): Collection<T>;

  filter(callback: Callback<boolean, [V, string | number]>): Collection<V>;

  get(key: string | number, defaultValue?: Nullable<V>): Nullable<V>;

  set(key: string | number, value: V): Collection<V>;

  delete(key: string | number): Collection<V>;

  pluck<T>(key: NestedKeys<V>): Collection<T>;

  toArray(): V[];
}
