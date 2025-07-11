import { randomUUID } from "node:crypto";

export class UniqueValueID {
  private value: string;

  toString() {
    return this.value;
  }

  toValue() {
    return this.value;
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID();
  }

  public equals(id: UniqueValueID) {
    return id.toValue() === this.value;
  }
}
