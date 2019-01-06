/**
 * MyInterface class, creating a GUI interface.
 */
class MyInterface extends CGFinterface {
  /**
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Initializes the interface.
   * @param {CGFapplication} application
   */
  init(application) {
    super.init(application);
    this.gui = new dat.GUI();
    this.cameraController;
    this.initKeys();
    return true;
  }

  /**
   * Adds a folder containing the IDs of the lights passed as parameter.
   * @param {array} lights
   */
  addLightsGroup(lights) {

    var group = this.gui.addFolder("Lights");

    for (var key in lights) {
      if (lights.hasOwnProperty(key)) {
        this.scene.lightValues[key] = lights[key].enabled;
        group.add(this.scene.lightValues, key);
      }
    }
  }

  /**
   * Adds a folder containing all the game settings
   */
  addGameSettings() {
    var group = this.gui.addFolder("Game");
    var scene = this.scene;

    group.add(this.scene.hawalis, 'gameDifficulty', { Easy: '1', Hard: '2' }).name("Difficulty");
    group.add(this.scene.hawalis, 'gameMode', { 'Player v Player': '1', 'Player v Bot': '2', 'Bot v Bot': '3' }).name("Mode");
    group.add(this.scene.hawalis, 'startGame').name("Start");
    group.add(this.scene.hawalis, 'undo').name("Undo");
    group.add(this.scene.hawalis, 'playMovie').name("Movie");
    group.add(this.scene.hawalis, 'quitGame').name("Quit");
    group.add(this.scene.hawalis, 'velocity', 1, 10).step(1).name("Speed");
    group.add(this.scene.hawalis, 'timeout', 5, 120).step(5).name("Timeout");

    var controller = group.add(this.scene, 'currentScene', ["classic", "zen", "none"]).name("Scene");
    controller.onChange(function(value) {
      scene.changeScene(value);
    });
  }

  /**
   * Adds a list containing the IDs of the views passed as parameter.
   * @param {array} views
   */
  addViews(views) {
    var group = this.gui.addFolder("Views");
    var scene = this.scene;

    var viewsID = [];
    for (var key in views)
      viewsID.push(key);

    var controller = group.add(this.scene, 'currentCamera', viewsID).name("Camera");
    group.add(this.scene, 'cameraAnimation').name("Animation");

    controller.onChange(function(value) {
      scene.updateCamera(value, scene.cameraAnimation);
    });
  };

  /**
   * Starts the keyboard event listener
   */
  initKeys() {
    this.scene.gui = this;
    this.processKeyboard = function() {};
    this.activeKeys = {};
  };

  /**
   * Updates currentMaterial when the M key is pressed
   */
  processKeyDown(event) {
    this.activeKeys[event.code] = true;
    if (event.key == "m" || event.key == "M")
      this.scene.currentMaterial++;
    this.activeKeys[event.code] = false;
  };
}
