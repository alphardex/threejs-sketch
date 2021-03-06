import * as marcher from "marcher.js";

import * as kokomi from "kokomi.js";

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    const mar = new marcher.Marcher({
      antialias: false,
    });

    const map = new marcher.SDFMapFunction();

    // union
    {
      const layer = new marcher.SDFLayer();

      const g = new marcher.GroupSDF({ mapFuncName: "g1" });
      mar.addGroup(g);
      layer.addPrimitive(g);

      const box = new marcher.BoxSDF({
        sdfVarName: "d1",
      });
      g.addPrimitive(box);
      box.round(0.1);

      const sphere = new marcher.SphereSDF({
        sdfVarName: "d2",
      });
      g.addPrimitive(sphere);
      sphere.translateY(-0.75);

      const result = box.union(sphere);

      g.translate(3, 0, 2);

      map.addLayer(layer);
    }

    // intersection
    {
      const layer = new marcher.SDFLayer();

      const g = new marcher.GroupSDF({ mapFuncName: "g2" });
      mar.addGroup(g);
      layer.addPrimitive(g);

      const box = new marcher.BoxSDF({
        sdfVarName: "d1",
      });
      g.addPrimitive(box);
      box.round(0.1);

      const sphere = new marcher.SphereSDF({
        sdfVarName: "d2",
      });
      g.addPrimitive(sphere);
      sphere.translateY(-0.75);

      const result = box.intersect(sphere);

      g.translate(0, 0, 2);

      map.addLayer(layer);
    }

    // subtraction
    {
      const layer = new marcher.SDFLayer();

      const g = new marcher.GroupSDF({ mapFuncName: "g3" });
      mar.addGroup(g);
      layer.addPrimitive(g);

      const box = new marcher.BoxSDF({
        sdfVarName: "d1",
      });
      g.addPrimitive(box);
      box.round(0.1);

      const sphere = new marcher.SphereSDF({
        sdfVarName: "d2",
      });
      g.addPrimitive(sphere);
      sphere.translateY(-0.75);

      const result = box.subtract(sphere);

      g.translate(-3, 0, 2);

      map.addLayer(layer);
    }

    // smooth union
    {
      const layer = new marcher.SDFLayer();

      const g = new marcher.GroupSDF({ mapFuncName: "g4" });
      mar.addGroup(g);
      layer.addPrimitive(g);

      const box = new marcher.BoxSDF({
        sdfVarName: "d1",
      });
      g.addPrimitive(box);
      box.round(0.1);

      const sphere = new marcher.SphereSDF({
        sdfVarName: "d2",
      });
      g.addPrimitive(sphere);
      sphere.translateY(-0.75);

      const result = box.smoothUnion(sphere);

      g.translate(3, 0, -2);

      map.addLayer(layer);
    }

    // smooth intersection
    {
      const layer = new marcher.SDFLayer();

      const g = new marcher.GroupSDF({ mapFuncName: "g5" });
      mar.addGroup(g);
      layer.addPrimitive(g);

      const box = new marcher.BoxSDF({
        sdfVarName: "d1",
      });
      g.addPrimitive(box);
      box.round(0.1);

      const sphere = new marcher.SphereSDF({
        sdfVarName: "d2",
      });
      g.addPrimitive(sphere);
      sphere.translateY(-0.75);

      const result = box.smoothIntersect(sphere);

      g.translate(0, 0, -2);

      map.addLayer(layer);
    }

    // smooth subtraction
    {
      const layer = new marcher.SDFLayer();

      const g = new marcher.GroupSDF({ mapFuncName: "g6" });
      mar.addGroup(g);
      layer.addPrimitive(g);

      const box = new marcher.BoxSDF({
        sdfVarName: "d1",
      });
      g.addPrimitive(box);
      box.round(0.1);

      const sphere = new marcher.SphereSDF({
        sdfVarName: "d2",
      });
      g.addPrimitive(sphere);
      sphere.translateY(-0.75);

      const result = box.smoothSubtract(sphere);

      g.translate(-3, 0, -2);

      map.addLayer(layer);
    }

    mar.setMapFunction(map);

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
