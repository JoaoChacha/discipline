export type Topic =
  | "me"
  | "friends"
  | "invitations"
  | "charities"
  | "paymentMethods"
  | "commitments"
  | `commitment:${string}`;

export interface BusEvent {
  topic: Topic;
}

type Listener = (event: BusEvent) => void;

export function createEventBus() {
  const listeners = new Map<string, Set<Listener>>();

  function key(userId: string, topic: Topic | "*") {
    return `${userId}:${topic}`;
  }

  function subscribe(
    userId: string,
    topics: Topic[],
    signal?: AbortSignal,
  ): AsyncIterable<BusEvent> {
    const queue: BusEvent[] = [];
    let notify: (() => void) | undefined;

    const listener: Listener = (event) => {
      queue.push(event);
      notify?.();
    };

    const keys = ["*", ...topics].map((topic) =>
      key(userId, topic as Topic | "*"),
    );
    for (const entry of keys) {
      const set = listeners.get(entry) ?? new Set();
      set.add(listener);
      listeners.set(entry, set);
    }

    const cleanup = () => {
      for (const entry of keys) {
        const set = listeners.get(entry);
        set?.delete(listener);
        if (set?.size === 0) listeners.delete(entry);
      }
    };

    signal?.addEventListener(
      "abort",
      () => {
        cleanup();
        notify?.();
      },
      { once: true },
    );

    return {
      async *[Symbol.asyncIterator]() {
        try {
          while (!signal?.aborted) {
            if (queue.length === 0) {
              await new Promise<void>((resolve) => {
                notify = resolve;
                if (signal?.aborted) resolve();
              });
              notify = undefined;
            }
            const next = queue.shift();
            if (next) yield next;
          }
        } finally {
          cleanup();
        }
      },
    };
  }

  function publish(userIds: Iterable<string>, topic: Topic) {
    const event: BusEvent = { topic };
    const unique = new Set([...userIds].filter(Boolean));
    for (const userId of unique) {
      for (const entry of [key(userId, topic), key(userId, "*")]) {
        listeners.get(entry)?.forEach((listener) => listener(event));
      }
    }
  }

  function listenerCount() {
    return [...listeners.values()].reduce((sum, set) => sum + set.size, 0);
  }

  return { subscribe, publish, listenerCount };
}

export const events = createEventBus();

export async function* live<T>(
  userId: string,
  topics: Topic[],
  load: () => Promise<T>,
  signal?: AbortSignal,
): AsyncGenerator<T> {
  yield await load();
  for await (const _event of events.subscribe(userId, topics, signal)) {
    yield await load();
  }
}
