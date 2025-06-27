import { UniqueValueID } from "../entities/unique-value-id";

export interface DomainEvent {
  ocurredAt: Date;
  getAggregateId(): UniqueValueID;
}
