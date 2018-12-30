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
    this.currentCamera;
    this.currentMaterial = 0;
    this.showAxis = true;
    this.previous = -1;
    this.delta;
    this.paused = false;
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
		this.setPickEnabled(true);
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

    for (var key in this.graph.lights) {
      if (i >= 8)
      break;

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

    // Adds animations group.
    this.interface.addAnimations();

    this.sceneInited = true;
    this.setUpdatePeriod(10);
  }

  /**
  * Updates camera appropriately depending on the view, whether it's perspective or ortho
  * @param {string} newCamera id for the new camera
  */
  updateCamera(newCamera){
    this.currentCamera = newCamera;

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
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.updateProjectionMatrix();
    this.loadIdentity();

    this.applyViewMatrix();

    this.pushMatrix();

      if (this.sceneInited) {
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

        this.graph.displayScene();
      }

    this.popMatrix();
  };

  /**
  * Sets paused to false, allowing animations to play
  */
  playAnimation(){
    this.paused = false;
  };

  /**
  * Sets paused to true, pausing the animations
  */
  pauseAnimation(){
    this.paused = true;
  };

  /**
   * Resets all animations
   */
  restartAnimation(){
    for(var key1 in this.graph.components){
      this.graph.components[key1].currentAnimation = 0;
      for(var key2 in this.graph.components[key1].animations)
        this.graph.components[key1].animations[key2].reset();
    }

    this.paused = false;
  };

  /**
  * Updates delta (time since last update) and previous (previous currTime)
  * @param {number} currTime current time in milliseconds
  */
  update(currTime) {
    if(this.previous == -1)
      this.delta = 0;
    else
      this.delta = currTime - this.previous;

    this.previous = currTime;
  }
}
