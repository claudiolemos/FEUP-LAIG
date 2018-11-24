#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;  // water's texture
uniform sampler2D uSampler2; // water's wave height map
uniform float texScale;      // number of times the water texture will be repeated
uniform float delta;         // xz offset for the water's texture movement

// Sets the color with the water's texture in a new position, applying
// the delta (water movement) and the texScale (texture repetition)

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord*texScale+delta);
	gl_FragColor = color;
}
