#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;  // terrain's texture
uniform sampler2D uSampler2; // terrain's height map

// Sets the color with the terrain's texture

void main() {
	gl_FragColor = texture2D(uSampler, vTextureCoord);
}
