const EventBusFactory = require("./index");

test("Test a published message received", () => {
  const EventBus = EventBusFactory();

  EventBus.listen("new-message", (payload) => `The message is "${payload}"`);

  const message = "You are awesome!";

  expect(EventBus.fire("new-message", message)[0]).toBe(
    `The message is "${message}"`
  );
});

test("Test another event subscriber", () => {
  const EventBus = EventBusFactory();

  EventBus.listen("another-event", () => null);

  expect(EventBus.fire("another-event", "null")).toStrictEqual([null]);
});

test("Test unsubscribe from event", () => {
  const EventBus = EventBusFactory();
  const listener = (payload) => payload;

  EventBus.listen("new-event", listener);
  EventBus.unsubscribe("new-event", listener);

  expect(EventBus.fire("new-event", true)).toStrictEqual([]);
});
test("Test multiple listeners to one event", () => {
  const EventBus = EventBusFactory();
  EventBus.listen(
    "event",
    (payload) => `hello I'm the 1st event, here's your payload ${payload}`
  );
  EventBus.listen(
    "event",
    (payload) => `I'm the 2nd event, fancy some payload?${payload}`
  );
  const payload = "Im the payload!";
  expect(EventBus.fire("event", payload)).toEqual([
    `hello I'm the 1st event, here's your payload ${payload}`,
    `I'm the 2nd event, fancy some payload?${payload}`,
  ]);
});
test("Test firing an event with no listener", () => {
  const EventBus = EventBusFactory();
  const payload = "Im the payload!";
  expect(EventBus.fire("event", "im a payload")).toBe(undefined);
});

test("Test adding 2 listeners, then firing the event, unsubscribing 1 event then firing again", () => {
  const EventBus = EventBusFactory();
  const listener1 = (payload) =>
    `hello I'm the 1st event, here's your payload ${payload}`;
  const listener2 = (payload) =>
    `I'm the 2nd event, fancy some payload?${payload}`;
  const payload = "Im the payload!";
  EventBus.listen("event", listener1);
  EventBus.listen("event", listener2);
  expect(EventBus.fire("event", payload)).toEqual([
    `hello I'm the 1st event, here's your payload ${payload}`,
    `I'm the 2nd event, fancy some payload?${payload}`,
  ]);
  EventBus.unsubscribe("event", listener2);
  expect(EventBus.fire("event", payload)).toEqual([
    `hello I'm the 1st event, here's your payload ${payload}`,
  ]);
});

test("Test invalid arguments to listen function", () => {
  const EventBus = EventBusFactory();
  EventBus.listen(0, () => null); // event name
  EventBus.listen("test", "tests"); // invalid listener
  EventBus.listen(); // arguments
  expect(EventBus.fire("test")).toBe(undefined);
});
test("test unsubscribe multiple listeners", () => {
  const EventBus = EventBusFactory();
  const listener = (payload) => payload;
  const listener2 = (payload) => payload;
  EventBus.listen("event", listener);
  EventBus.listen("event", listener2);
  EventBus.unsubscribe("event", listener);
  EventBus.unsubscribe("event", listener2);
  expect(EventBus.fire("event", true)).toStrictEqual([]);
});
