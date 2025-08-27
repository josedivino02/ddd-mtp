import EventHandlerInterface from './event-handler.interface';
import EventInterface from './event.interface';

export default interface EventDispatcherInterface {
  notify(event: EventInterface): void;
  register(eventName: string, EventHandler: EventHandlerInterface): void;
  unregister(eventName: string, EventHandler: EventHandlerInterface): void;
  unregisterAll(): void;
}