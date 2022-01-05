class Vector extends Array {
  constructor(...components) {
    super(...components);

    this.x = components[0];
    this.y = components[1];
    this.z = components[2];
  }

  // Initialize vector using polar coordinates in n dimensions
  static fromPolar(radius, ...angles) {
    let euclidean = Array(angles.length + 1).fill(0);
    let sinProduct = 1;

    for (let i = 0; i < angles.length; i++) {
      euclidean[i] = sinProduct * Math.cos(angles[i]);
      sinProduct *= Math.sin(angles[i]);
    }

    euclidean[angles.length] = sinProduct;
    euclidean = euclidean
      .map(coordinate => coordinate * radius);

    return new Vector(...euclidean);
  }

  clone() {
    return new Vector(...this);
  }

  mul(factor) {
    return new Vector(...this
      .map(component => component * factor));
  }

  div(factor) {
    return new Vector(...this
      .map(component => component / factor));
  }

  mag() {
    return Math.sqrt(
      this
        .map(component => Math.pow(component, 2))
        .reduce((acc, value) => acc + value));
  }

  unit() {
    return this.div(this.mag());
  }

  scale(length) {
    return this.unit().mul(length);
  }

  add(other) {
    return new Vector(...this.map(
      (component, index) => component + other[index]));
  }

  sub(other) {
    return new Vector(...this.map(
      (component, index) => component - other[index]));
  }

  dist(other) {
    return this.sub(other).mag();
  }

  dot(other) {
    return this
      .map((component, index) => component * other[index])
      .reduce((acc, value) => acc + value);
  }

  floor() {
    return new Vector(...this.map(
      (component) => Math.floor(component)));
  }

  // Need to make this general
  // // Non-standard multiplication of two vectors (returns a vector)
  // vectorMult(other) {
  //   return new Vector(
  //     this.x * other.x,
  //     this.y * other.y,
  //     this.z * other.z,
  //   );
  // }

  cross(other) {
    return new Vector(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  rotateX(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Vector(
      this.x,
      this.y * cos - this.z * sin,
      this.y * sin + this.z * cos,
    );
  }

  rotateY(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Vector(
      this.x * cos + this.z * sin,
      this.y,
      this.z * cos - this.x * sin,
    );
  }

  rotateZ(angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    return new Vector(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos,
      this.z,
    );
  }

  rotate(angle) {
    return this
      .rotateX(angle.x)
      .rotateY(angle.y)
      .rotateZ(angle.z);
  }

  rotateAround(pivot, angle) {
    return this
      .sub(pivot)
      .rotate(angle)
      .add(pivot);
  }

  project() {
    return new Vector(
      this.x / this.z,
      this.y / this.z,
      0,
    );
  }

  abs() {
    return new Vector(
      Math.abs(this.x),
      Math.abs(this.y),
      Math.abs(this.z),
    );
  }

  projectZ() {
    return new Vector(
      this.x / this.z,
      this.y / this.z,
      0,
    );
  }
}

function v(...components) {
  return new Vector(...components);
}

function v2(x = 0, y = 0) {
  return new Vector(x, y);
}

function v3(x = 0, y = 0, z = 0) {
  return new Vector(x, y, z);
}