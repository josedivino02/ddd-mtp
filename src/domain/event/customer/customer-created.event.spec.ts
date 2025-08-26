import EventDispatcher from '../@shared/event-dispatcher';
import CustomerCreatedEvent from './customer-created.event';
import SendFirstMessageWhenCustomerIsCreatedHandler from './handler/send-first-message-when-customer-is-created.handler';
import SendSecondMessageWhenCustomerIsCreatedHandler from './handler/send-second-message-when-customer-is-created.handler copy';

describe("customer created event tests", () => {

  it("should register customer created event handlers", () => {
    const eventDispatcher = new EventDispatcher();

    const eventHandler1 = new SendFirstMessageWhenCustomerIsCreatedHandler();
    const eventHandler2 = new SendSecondMessageWhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
  })

  it("should call both handlers when notifying CustomerCreatedEvent", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new SendFirstMessageWhenCustomerIsCreatedHandler();
    const handler2 = new SendSecondMessageWhenCustomerIsCreatedHandler();

    const spyHandler1 = jest.spyOn(handler1, "handle");
    const spyHandler2 = jest.spyOn(handler2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);

    const eventData = { id: "1", name: "José Divino" };
    const customerCreatedEvent = new CustomerCreatedEvent(eventData);

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyHandler1).toHaveBeenCalledTimes(1);
    expect(spyHandler2).toHaveBeenCalledTimes(1);
  });

  it("should unregister a specific handler", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new SendFirstMessageWhenCustomerIsCreatedHandler();
    const handler2 = new SendSecondMessageWhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);

    eventDispatcher.unregister("CustomerCreatedEvent", handler1);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(handler2);
  });

  it("should unregister all handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const handler1 = new SendFirstMessageWhenCustomerIsCreatedHandler();
    const handler2 = new SendSecondMessageWhenCustomerIsCreatedHandler();

    eventDispatcher.register("CustomerCreatedEvent", handler1);
    eventDispatcher.register("CustomerCreatedEvent", handler2);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
  });
})