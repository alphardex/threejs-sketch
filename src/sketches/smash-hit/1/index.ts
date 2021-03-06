import * as kokomi from "kokomi.js";
import Floor from "./components/floor";
import Environment from "./components/environment";
import Box from "./components/box";
import Ball from "./components/ball";

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    this.camera.position.set(-3, 3, 4);

    const environment = new Environment(this);
    environment.addExisting();

    const floor = new Floor(this);
    floor.addExisting();

    const box = new Box(this);
    box.addExisting();

    const ball = new Ball(this);
    ball.addExisting();
  }
}

const createSketch = () => {
  const sketch = new Sketch();
  sketch.create();
  return sketch;
};

export default createSketch;
