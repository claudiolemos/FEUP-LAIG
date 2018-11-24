attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;
uniform float delta;
uniform float texScale;

void main() {
	vTextureCoord = aTextureCoord;
	vec3 offset = aVertexNormal*texture2D(uSampler2, vTextureCoord*texScale+delta).r*normScale;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
