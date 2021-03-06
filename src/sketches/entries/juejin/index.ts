import * as marcher from "marcher.js";

import * as kokomi from "kokomi.js";

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    const mar = new marcher.Marcher({
      antialias: true,
    });

    const mat = new marcher.SDFMaterial();
    mat.addColorMaterial(marcher.DEFAULT_MATERIAL_ID, 30, 128, 255);
    mar.setMaterial(mat);

    const map = new marcher.SDFMapFunction();
    mar.setMapFunction(map);

    const layer1 = new marcher.SDFLayer();
    map.addLayer(layer1);

    const box1 = new marcher.BoxSDF({
      sdfVarName: "d1",
      width: 1,
      height: 0.1,
      depth: 1,
    });
    box1.round(0.1);
    box1.rotate(45, "y");
    layer1.addPrimitive(box1);

    const box2 = new marcher.BoxSDF({
      sdfVarName: "d2",
      width: 0.6,
      height: 0.1,
      depth: 0.6,
    });
    box2.round(0.1);
    box2.translate(0, -0.4, 0);
    box2.rotate(45, "y");
    layer1.addPrimitive(box2);

    const box3 = new marcher.BoxSDF({
      sdfVarName: "d3",
      width: 0.2,
      height: 0.1,
      depth: 0.2,
    });
    box3.round(0.1);
    box3.translate(0, -0.8, 0);
    box3.rotate(45, "y");
    layer1.addPrimitive(box3);

    const rayMarchingQuad = new kokomi.RayMarchingQuad(this, mar);
    rayMarchingQuad.render();
  }
}

const createSketch = () => {
  const sketch = new Sketch();
  sketch.create();
  return sketch;
};

export default createSketch;
