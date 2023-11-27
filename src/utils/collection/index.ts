import type { Collection } from "./Collection";
import type { Collectable } from "./types";
import { ArrayCollection } from "./ArrayCollection";
import { RecordCollection } from "./RecordCollection";
import { isArray, isRecord } from "./utils";

export type { Collection } from "./Collection";

export function collect<T>(collection: Collectable<T>): Collection<T> {
  if (isArray(collection)) {
    return new ArrayCollection(collection);
  }

  if (isRecord(collection)) {
    return new RecordCollection(collection);
  }

  return new ArrayCollection(
    [collection].filter((value) => value !== null && value !== undefined)
  );
}
