import { describe, expect, it } from "vitest";

import { createEventBus } from "./events";

describe("event bus", () => {
  it("delivers published topics to the matching user", async () => {
    const bus = createEventBus();
    const received: string[] = [];
    const controller = new AbortController();

    const consumer = (async () => {
      for await (const event of bus.subscribe(
        "maya",
        ["commitments"],
        controller.signal,
      )) {
        received.push(event.topic);
        break;
      }
    })();

    await new Promise((resolve) => setTimeout(resolve, 10));
    bus.publish(["maya", "alex"], "commitments");
    await consumer;

    expect(received).toEqual(["commitments"]);
    expect(bus.listenerCount()).toBe(0);
  });

  it("does not notify a different user", async () => {
    const bus = createEventBus();
    const received: string[] = [];
    const controller = new AbortController();

    const consumer = (async () => {
      for await (const event of bus.subscribe(
        "maya",
        ["friends"],
        controller.signal,
      )) {
        received.push(event.topic);
      }
    })();

    await new Promise((resolve) => setTimeout(resolve, 10));
    bus.publish(["alex"], "friends");
    controller.abort();
    await consumer;

    expect(received).toEqual([]);
  });
});
