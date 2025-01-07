import { Memo } from "./note.model";

export class Note {
  constructor(
    public data: Memo[] = [
      {
        data: "Moonhalo",
      },
    ]
  ) {}

  add(note: Memo) {
    this.data.push(note);

    return this.data;
  }

  remove(index: number) {
    return this.data.splice(index, 1);
  }

  update(index: number, note: Partial<Memo>) {
    return (this.data[index] = { ...this.data[index], ...note });
  }
}
