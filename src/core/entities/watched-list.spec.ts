import { WatchedList } from "./watched-list";

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b;
  }
}

describe("watched list", () => {
  it("should be able to create a watched list with initial items", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    expect(list.currentItems).toEqual([1, 2, 3]);
  });

  it("shoud be able to add new items to the list", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.add(4);

    expect(list.currentItems).toHaveLength(4);
    expect(list.getNewItems()).toEqual([4]);
  });

  it("shoud be able to remove items from the list", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.remove(2);

    expect(list.currentItems).toHaveLength(2);
    expect(list.getRemovedItems()).toEqual([2]);
  });

  it("shoud be able to add an item even if it was removed right before", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.remove(2);

    list.add(list.getRemovedItems()[0]);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it("shoud be able to remove an item even if it was add right before", () => {
    const list = new NumberWatchedList([1, 2, 3]);
    list.add(4);

    list.remove(list.getNewItems()[0]);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it("shoud be able to update the watched list items", () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.update([2, 3, 4]);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([1]);
    expect(list.getNewItems()).toEqual([4]);
  });

  it("shoud be able to update to create a question whitout any attachments e yet edit it", () => {
    const list = new NumberWatchedList([]);

    list.update([2, 3, 4]);

    expect(list.currentItems).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([2, 3, 4]);
  });
});
