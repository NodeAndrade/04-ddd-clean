import { UniqueValueID } from "./unique-value-id";

export abstract class Entity<Props> {
  private _id: UniqueValueID;

  protected props: Props;

  get id() {
    return this._id;
  }

  protected constructor(props: Props, id?: UniqueValueID) {
    this.props = props;
    this._id = id ?? new UniqueValueID();
  }
}
