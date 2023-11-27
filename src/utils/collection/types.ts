export type GetNestedKeys<T> = T extends Record<string | number, unknown>
  ? {
      [K in keyof T]: K extends string | number
        ? `${K}` | `${K & keyof T}.${GetNestedKeys<T[K]>}`
        : never;
    }[keyof T]
  : never;

export type FilterNestedKeys<T> = T extends `${infer K}.` ? K : T;

export type Collectable<T> = T[] | Record<string | number, T> | T;

export type Callback<TReturn, TArgs extends unknown[]> = (
  ...args: TArgs
) => TReturn;

export type OptionalReturn<T> = T | void;

export type Nullable<T> = T | null;
