class NArray extends Array {
  constructor(shape, data) {
    const length = shape
      .reduce((product, factor) => product * factor);

    super(length);
    if (data?.length) this.setAll(data.flat(Infinity));

    this.shape = shape;
    this.dimensions = shape.length;
    this.neighborOffsets = this.getNeighborOffsets();
  }

  *cartesianProduct([head, ...tail]) {
    const remainder = tail.length ? this.cartesianProduct(tail) : [[]];
    for (let r of remainder) for (let h of head) yield [h, ...r];
  }

  static fromNested(shape, data) {
    return new NArray(shape, data.flat(Infinity));
  }

  getIndex(location) {
    const offsets = [1];
    let previous = 1;

    for (let i = 1; i < location.length; i++) {
      offsets.push(previous *= this.shape[i]);
    }

    return location.reduce((sum, component, i) =>
      sum + (component * offsets[i]), 0);
  }

  getNeighborOffsets() {
    const offsets1D = Array(this.dimensions).fill([-1, 0, 1]);
    return [...this.cartesianProduct(offsets1D)]
      .filter(neighbor => !neighbor.every(d => d === 0));
  }

  getNeighbors(location) {
    const neighbors = this.neighborOffsets.map((neighbor) => {
      const neighborLocation = neighbor
        .map((value, index) => (value + location[index]));
      
      return this.get(neighborLocation);
    });

    return neighbors;
  }

  clone() {
    return new NArray(this.shape, [...this]);
  }

  addArray(other) {
    other.map((element, index) => this[index] += element);
  }

  get(location) {
    return this[this.getIndex(location)];
  }

  set(location, value) {
    return this[this.getIndex(location)] = value;
  }

  setAll(data) {
    data.map((value, index) => this[index] = value);
  }

  getRaw() {
    return [...this];
  }
}


// const shape = new Vector(4, 4, 4, 4);
// const arr = new NArray(shape);

// arr.set([0, 0, 0, 0], 1);
// arr.set([0, 1, 0, 0], 1);

// console.log(arr.getNeighbors(new Vector(1, 1, 1, 1)));

// const shape = new Vector(10, 10);
// const arr = new NArray(shape);

// console.log(arr)

// arr.set([0, 0], 1);
// arr.set([0, 1], 1);

// console.log(arr.getNeighbors(new Vector(1, 1)));