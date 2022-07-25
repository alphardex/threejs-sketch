uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;
varying vec3 vNormal;

void main(){
    vec2 p=vUv;
    vec3 col=vec3(p,0.);
    
    csm_DiffuseColor=vec4(col,1.);
    csm_FragColor=vec4(vNormal,1.);
}
