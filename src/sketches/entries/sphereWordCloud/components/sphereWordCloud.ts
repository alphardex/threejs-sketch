import * as THREE from "three";
import * as kokomi from "kokomi.js";
import _ from "lodash";
import mitt, { type Emitter } from "mitt";

export interface SphereWordCloudConfig {
  radius: number;
  segment: number;
  pointSize: number;
  pointOpacity: number;
  lineOpacity: number;
}

class SphereWordCloud extends kokomi.Component {
  points: THREE.Points;
  positions: THREE.Vector3[];
  htmls: kokomi.Html[];
  lines: THREE.Line[];
  lineOpacity: number;
  emitter: Emitter<any>;
  constructor(base: kokomi.Base, config: Partial<SphereWordCloudConfig> = {}) {
    super(base);

    const {
      radius = 0.5,
      segment = 8,
      pointSize = 0.01,
      pointOpacity = 1,
      lineOpacity = 1,
    } = config;

    this.lineOpacity = lineOpacity;

    const geometry = new THREE.SphereGeometry(radius, segment, segment);
    const material = new THREE.PointsMaterial({
      size: pointSize,
      transparent: true,
      opacity: pointOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    this.points = points;

    this.positions = [];
    this.htmls = [];
    this.lines = [];

    this.getPositions();

    this.emitter = mitt();
  }
  addExisting(): void {
    const { base, points } = this;
    const { scene } = base;

    scene.add(points);
  }
  getPositions() {
    const positionAttribute = this.points.geometry.attributes.position;
    const positions = kokomi.convertBufferAttributeToVector(positionAttribute);
    const uniqPositions = _.uniqWith(positions, _.isEqual);
    this.positions = uniqPositions;
  }
  randomizePositions() {
    this.positions = this.positions.map((position) => {
      const offset = THREE.MathUtils.randFloat(0.4, 1);
      const offsetVector = new THREE.Vector3(offset, offset, offset);
      const targetPosition = position.multiply(offsetVector);
      return targetPosition;
    });
  }
  addHtmls() {
    const { positions } = this;
    const htmls = positions.map((position, i) => {
      const el = document.querySelector(`.point-${i + 1}`) as HTMLElement;
      const html = new kokomi.Html(this.base, el, position);
      return html;
    });
    this.htmls = htmls;
  }
  addLines() {
    const { positions } = this;
    const material = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: this.lineOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lines = positions.map((position) => {
      const points = [this.points.position, position];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.base.scene.add(line);
      return line;
    });
    this.lines = lines;
  }
  listenForHoverHtml(onMouseOver: any, onMouseLeave: any) {
    const { htmls } = this;
    htmls.forEach((html) => {
      html.el?.addEventListener("mouseover", () => {
        this.emitter.emit("mouseover", html.el);
      });
      html.el?.addEventListener("mouseleave", () => {
        this.emitter.emit("mouseleave", html.el);
      });
    });
    this.emitter.on("mouseover", (el: HTMLElement) => {
      onMouseOver(el);
    });
    this.emitter.on("mouseleave", (el: HTMLElement) => {
      onMouseLeave(el);
    });
  }
}

export default SphereWordCloud;