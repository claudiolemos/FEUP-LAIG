var DEGREE_TO_RAD = Math.PI / 180;

/**
* XMLscene class, representing the scene that is to be rendered.
*/
class XMLscene extends CGFscene {
  /**
  * @constructor
  * @param {MyInterface} myinterface
  */
  constructor(myinterface) {
    super();

    this.interface = myinterface;
    this.lightValues = {};
    this.selectedCamera;
    this.showAxis = true;
  }

  /**
  * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
  * @param {CGFApplication} application
  */
  init(application) {
    super.init(application);

    this.sceneInited = false;

    this.initCameras();

    this.enableTextures(true);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);


    this.axis = new CGFaxis(this);
  }

  /**
  * Initializes the scene cameras.
  */
  initCameras() {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 10, 15), vec3.fromValues(0, 0, 0));
  }
  /**
  * Initializes the scene lights with the values read from the XML file.
  */
  initLights() {
    var i = 0;
    // Lights index.

    // Reads the lights from the scene graph.
    for (var key in this.graph.lights) {
      if (i >= 8)
      break;              // Only eight lights allowed by WebGL.

      if (this.graph.lights.hasOwnProperty(key)) {
        var light = this.graph.lights[key];

        this.lights[i].setPosition(light.location.x, light.location.y, light.location.z, light.location.w);
        this.lights[i].setAmbient(light.ambient.r, light.ambient.g, light.ambient.b, light.ambient.a);
        this.lights[i].setDiffuse(light.diffuse.r, light.diffuse.g, light.diffuse.b, light.diffuse.a);
        this.lights[i].setSpecular(light.specular.r, light.specular.g, light.specular.b, light.specular.a);

        if(light.type == "spot"){
          this.lights[i].setSpotCutOff(light.angle);
          this.lights[i].setSpotExponent(light.exponent);
          this.lights[i].setSpotDirection(light.target.x - light.location.x, light.target.y - light.location.y, light.target.z - light.location.z);
        }

        this.lights[i].setVisible(true);

        if (light.enabled)
        this.lights[i].enable();
        else
        this.lights[i].disable();

        this.lights[i].update();

        i++;
      }
    }
  }

  /* Handler called when the graph is finally loaded.
  * As loading is asynchronous, this may be called already after the application has started the run loop
  */
  onGraphLoaded() {
    this.updateCamera(this.graph.default);

    this.axis = new CGFaxis(this, this.graph.axis_length);

    this.setGlobalAmbientLight(this.graph.ambient.r, this.graph.ambient.g, this.graph.ambient.b, this.graph.ambient.a);
    this.gl.clearColor(this.graph.background.r, this.graph.background.g, this.graph.background.b, this.graph.background.a);

    this.initLights();


    // Adds lights group.
    this.interface.addLightsGroup(this.graph.lights);

    // Adds show axis
    this.interface.gui.add(this, 'showAxis').name("Show axis");

    // Adds views group.
    this.interface.addViews(this.graph.views);

    this.sceneInited = true;
  }

  /**
  * Updates camera appropriately depending on the view, whether it's perspective or ortho
  */
  updateCamera(newCamera){
    this.selectedCamera = newCamera;

    if(this.graph.views[newCamera].type == "perspective")
      this.camera = new CGFcamera(this.graph.views[newCamera].angle, this.graph.views[newCamera].near, this.graph.views[newCamera].far, vec3.fromValues(this.graph.views[newCamera].from.x, this.graph.views[newCamera].from.y, this.graph.views[newCamera].from.z), vec3.fromValues(this.graph.views[newCamera].to.x, this.graph.views[newCamera].to.y, this.graph.views[newCamera].to.z));
    else if(this.graph.views[newCamera].type == "ortho")
      this.camera = new CGFcameraOrtho(this.graph.views[newCamera].left, this.graph.views[newCamera].right, this.graph.views[newCamera].bottom, this.graph.views[newCamera].top, this.graph.views[newCamera].near, this.graph.views[newCamera].far, vec3.fromValues(this.graph.views[newCamera].from.x, this.graph.views[newCamera].from.y, this.graph.views[newCamera].from.z), vec3.fromValues(this.graph.views[newCamera].to.x, this.graph.views[newCamera].to.y, this.graph.views[newCamera].to.z), vec3.fromValues(0,1,0));

    this.interface.setActiveCamera(this.camera);
  }


  /**
  * Displays the scene.
  */
  display() {
    // ---- BEGIN Background, camera and axis setup

    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.pushMatrix();

    if (this.sceneInited) {
      // Draw axis
      if(this.showAxis)
        this.axis.display();

      var i = 0;
      for (var key in this.lightValues) {
        if (this.lightValues.hasOwnProperty(key)) {
          if (this.lightValues[key]) {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
          }
          else {
            this.lights[i].setVisible(false);
            this.lights[i].disable();
          }
          this.lights[i].update();
          i++;
        }
      }

      // Displays the scene (MySceneGraph function).
      this.graph.displayScene();
    }
    else {
      // Draw axis
      if(this.showAxis)
        this.axis.display();
    }

    this.popMatrix();
    // ---- END Background, camera and axis setup
  }
}
