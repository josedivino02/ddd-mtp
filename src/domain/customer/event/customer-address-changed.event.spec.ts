import EventDispatcher from '../../@shared/event/event-dispatcher';
import CustomerAddressChangedEvent from './customer-address-changed.event';
import SendMessageWhenCustomerAddressIsChangedHandler from './handler/send-message-when-customer-address-is-changed.handler';

describe("CustomerAddressChangedEvent tests", () => {

  it("should register address changed event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const handler = new SendMessageWhenCustomerAddressIsChangedHandler();

    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(handler);
  });

  it("should notify handler when customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const handler = new SendMessageWhenCustomerAddressIsChangedHandler();
    const spyHandler = jest.spyOn(handler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", handler);

    const eventData = {
      id: "c1",
      nome: "José Divino",
      endereco: "Rua da rua, 1, São Paulo - 02468-024",
    };

    const customerAddressChangedEvent = new CustomerAddressChangedEvent(eventData);

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyHandler).toHaveBeenCalledTimes(1);
    expect(spyHandler).toHaveBeenCalledWith(customerAddressChangedEvent);
  });
})