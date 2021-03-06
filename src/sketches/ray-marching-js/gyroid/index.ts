import * as marcher from "marcher.js";

import * as kokomi from "kokomi.js";

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    const mar = new marcher.Marcher({
      antialias: false,
    });

    const mat = new marcher.SDFMaterial();
    mat.addColorMaterial("1.0", 0, 0, 0);
    mar.setMaterial(mat);

    const map = new marcher.SDFMapFunction();

    {
      const layer = new marcher.SDFLayer();

      // 组
      const group = new marcher.GroupSDF({
        mapFuncName: "g1",
        sdfVarName: "d0",
      });
      mar.addGroup(group);
      layer.addPrimitive(group);

      const sphere = new marcher.SphereSDF({
        sdfVarName: "d1",
        radius: 1,
      });
      group.addPrimitive(sphere);

      const gyroidTex = new marcher.GyroidSDF({
        sdfVarName: "d2",
        gyroidScale: 10,
      });
      group.addPrimitive(gyroidTex);

      const gyroid = sphere.intersect(gyroidTex);

      map.addLayer(layer);
    }

    mar.setMapFunction(map);

    mar.enableOrbitControls();

    const rayMarchingQuad = new kokomi.RayMarchingQuad(this, mar);
    rayMarchingQuad.render();

    console.log(mar.fragmentShader);
  }
}

const createSketch = () => {
  const sketch = new Sketch();
  sketch.create();
  return sketch;
};

export default createSketch;
