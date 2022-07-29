uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

uniform float uIntensity;

varying vec2 vUv;

varying float vNoise;

void main(){
    vec2 p=vUv;
    
    float distortVal=vNoise*uIntensity*2.;
    
    vec3 col=vec3(p*(1.-distortVal),1.);
    
    csm_DiffuseColor=vec4(col,1.);
}
