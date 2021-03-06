import * as THREE from "three";

import * as kokomi from "kokomi.js";

import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

interface ParticlesConfig {
  count: number;
  pointColor1: string;
  pointColor2: string;
  pointSize: number;
}

class Particles extends kokomi.Component {
  count: number;
  pointColor1: string;
  pointColor2: string;
  pointSize: number;
  geometry: THREE.BufferGeometry | null;
  material: THREE.ShaderMaterial | null;
  points: THREE.Points | null;
  constructor(base: kokomi.Base, config: Partial<ParticlesConfig> = {}) {
    super(base);

    const {
      count = 10000,
      pointColor1 = "#ff6030",
      pointColor2 = "#1b3984",
      pointSize = 1,
    } = config;

    this.count = count;
    this.pointColor1 = pointColor1;
    this.pointColor2 = pointColor2;
    this.pointSize = pointSize;

    this.geometry = null;
    this.material = null;
    this.points = null;
  }
  create() {
    const { base, count } = this;
    const { scene } = base;

    if (this.geometry) {
      this.geometry.dispose();
    }

    if (this.material) {
      this.material.dispose();
    }

    if (this.points) {
      scene.remove(this.points);
    }

    const geometry = new THREE.BufferGeometry();
    this.geometry = geometry;

    const positions = kokomi.makeBuffer(
      count,
      () => THREE.MathUtils.randFloat(-0.5, 0.5) * 50
    );
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const seeds = kokomi.makeBuffer(
      count,
      () => THREE.MathUtils.randFloat(0, 1),
      2
    );
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 2));

    const sizes = kokomi.makeBuffer(
      count,
      () => this.pointSize + THREE.MathUtils.randFloat(0, 1),
      1
    );
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        iTime: {
          value: 0,
        },
        iColor1: {
          value: new THREE.Color(this.pointColor1),
        },
        iColor2: {
          value: new THREE.Color(this.pointColor2),
        },
      },
    });
    this.material = material;

    const points = new THREE.Points(geometry, material);
    this.points = points;

    scene.add(points);

    this.changePos();
  }
  update(time: number): void {
    const elapsedTime = time / 1000;

    if (this.material) {
      const uniforms = this.material.uniforms;
      uniforms.iTime.value = elapsedTime;
    }
  }
  changePos() {
    const { geometry, count } = this;
    if (geometry) {
      const positionAttrib = geometry.attributes.position;

      kokomi.iterateBuffer(
        positionAttrib.array,
        count,
        (arr: number[], axis: THREE.Vector3) => {
          arr[axis.y] = Math.sin(arr[axis.x]);
        }
      );
    }
  }
}

export default Particles;
