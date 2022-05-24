import * as marcher from "marcher.js";

import * as kokomi from "kokomi.js";

class Sketch extends kokomi.Base {
  create() {
    new kokomi.OrbitControls(this);

    const mar = new marcher.Marcher({
      antialias: true,
    });

    // 材质
    const BLACK_MAT = "1.0";
    const WHITE_MAT = "2.0";
    const RED_MAT = "3.0";

    const mat = new marcher.SDFMaterial();
    mat.addColorMaterial(BLACK_MAT, 0, 0, 0);
    mat.addColorMaterial(WHITE_MAT, 255, 255, 255);
    mat.addColorMaterial(RED_MAT, 255, 0, 0);
    mar.setMaterial(mat);

    // sdf主函数
    const map = new marcher.SDFMapFunction();

    {
      // 图层
      const layer = new marcher.SDFLayer();

      // 组
      const group = new marcher.GroupSDF({
        mapFuncName: "g1",
        sdfVarName: "d0",
      });
      mar.addGroup(group);
      layer.addPrimitive(group);

      // 球内
      const sphere = new marcher.SphereSDF({
        sdfVarName: "d1",
        materialId: BLACK_MAT,
      });
      group.addPrimitive(sphere);

      // 按钮
      const button = new marcher.CylinderSDF({
        sdfVarName: "d2",
        materialId: WHITE_MAT,
        radius: 0.1,
        height: 0.54,
      });
      group.addPrimitive(button);
      button.rotateX(90);

      // 球壳（上）
      const shellUpper = new marcher.SphereSDF({
        sdfVarName: "d4",
        materialId: "3",
        radius: 0.55,
      });
      group.addPrimitive(shellUpper);

      const clipBoxUpper = new marcher.BoxSDF({
        sdfVarName: "d3",
        width: 0.55,
        height: 0.55,
        depth: 0.55,
      });
      group.addPrimitive(clipBoxUpper);
      clipBoxUpper.translateY(-0.6);

      const clipShellUpper = shellUpper.intersect(clipBoxUpper);

      // 球壳（下）
      const shellLower = new marcher.SphereSDF({
        sdfVarName: "d6",
        materialId: WHITE_MAT,
        radius: 0.55,
      });
      group.addPrimitive(shellLower);

      const clipBoxLower = new marcher.BoxSDF({
        sdfVarName: "d5",
        width: 0.55,
        height: 0.55,
        depth: 0.55,
      });
      group.addPrimitive(clipBoxLower);
      clipBoxLower.translateY(0.6);

      const clipShellLower = shellLower.intersect(clipBoxLower);

      // 球壳（上）：挖除中间镂空部分后
      const clipCylinderCenter1 = new marcher.CylinderSDF({
        sdfVarName: "d7",
        radius: 0.15,
        height: 0.6,
        materialId: RED_MAT,
      });
      group.addPrimitive(clipCylinderCenter1);
      clipCylinderCenter1.rotateX(90);

      const clipShellUpper2 = clipShellUpper.subtract(clipCylinderCenter1);

      // 球壳下：挖除中间镂空部分后
      const clipCylinderCenter2 = new marcher.CylinderSDF({
        sdfVarName: "d8",
        radius: 0.15,
        height: 0.6,
        materialId: WHITE_MAT,
      });
      group.addPrimitive(clipCylinderCenter2);
      clipCylinderCenter2.rotateX(90);

      const clipShellLower2 = clipShellLower.subtract(clipCylinderCenter2);

      map.addLayer(layer);
    }

    mar.setMapFunction(map);

    // 开启华丽光照
    mar.enableBeautifulLighting();

    // 定制相机
    const gsc = `
    vec3 getSceneColor(vec2 fragCoord){
      // pixel coordinates
      vec2 p=normalizeScreenCoords(fragCoord,iResolution.xy);
      
      // mouse
      vec2 mo=iMouse.xy/iResolution.xy;
      
      // time
      float time=32.+iTime*1.5;
      
      // camera
      // look-at target
      vec3 ta=vec3(0.,0.,0.);
      
      // ray origin
      // vec3 ro=ta+vec3(4.5*cos(7.*mo.x),1.3+2.*mo.y,4.5*sin(7.*mo.x));
      vec3 ro=ta+vec3(4.5*cos(.1*time+7.*mo.x),1.3+2.*mo.y,4.5*sin(.1*time+7.*mo.x));
      
      // focal length
      const float fl=4.5;
      
      // ray direction
      vec3 rd=getRayDirection(p,ro,ta,fl);
      
      // render
      vec3 col=render(ro,rd);
      
      // gamma
      col=toGamma(col);
      
      return col;
  }
    `;

    mar.setGetSceneColor(gsc);

    // 渲染
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
