#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float texScale;
uniform float delta;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord*texScale+delta);
	gl_FragColor = color;
}
