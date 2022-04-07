export default class RecordWithDefault<T> {
  data: Record<string, T> = {};

  constructor(public init: (key: string) => T) {}

  get(key: string) {
    let value = this.data[key];

    if (value === undefined) {
      value = this.init(key);
      this.data[key] = value;
    }

    return value;
  }

  set(key: string, value: T) {
    this.data[key] = value;
  }
}
