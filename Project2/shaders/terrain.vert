attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform sampler2D uSampler2; // terrain's height map
uniform float heightScale;   // factor scale for the terrain's height map

// Sets the position of the terrain with an offset of
// the height map multiplied by the height scale

void main() {
	vTextureCoord = aTextureCoord;
	vec3 offset = aVertexNormal*texture2D(uSampler2, vTextureCoord).r*heightScale;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
