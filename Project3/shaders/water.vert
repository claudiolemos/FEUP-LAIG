attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler2; // water's wave height map
uniform float heightScale;   // factor scale for the wave's height map
uniform float texScale;		   // number of times the water texture will be repeated
uniform float delta;         // xz offset for the water's texture movement

// Sets the position of the water with an offset
// of the wave height map multiplied by the height
// scale, while also adding the delta so that the
// wave height map follows the texture map

void main() {
	vTextureCoord = aTextureCoord;
	vec3 offset = aVertexNormal*texture2D(uSampler2, vTextureCoord*texScale+delta).r*heightScale;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
