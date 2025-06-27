import { AggregateRoot } from "../entities/aggregate-root";
import { UniqueValueID } from "../entities/unique-value-id";
import { DomainEvents } from "./domain-events";
import { vi } from "vitest";

class CustomAggregateCreated implements DomainEvents {
  public ocurredAt: Date;
  private aggregate: CustomAggregate;

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueValueID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
    return aggregate;
  }
}

describe("DomainEvents", () => {
  it("should be able to despatch and listen to events", () => {
    const callbackSpy = vi.fn();
    // Subscriber cadastrado (Ouvindo o evento de 'Resposta Criada')
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);
    // Criando uma resposta, porém SEM salvar no banco de dados
    const aggregate = CustomAggregate.create();
    //Estou assegurando que o evento foi criado, porém não foi despachado
    expect(aggregate.domainEvents).toHaveLength(1);
    //Estou salvando a resposta no banco de dados e assim despachando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id);
    // O Subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
