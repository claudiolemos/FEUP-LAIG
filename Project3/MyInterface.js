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
    group.open();

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
    var hawalis = this.scene.graph.primitives['hawalis'];

    var group = this.gui.addFolder("Game");
    group.open();
    group.add(hawalis, 'startGame').name("Start Game");
    group.add(hawalis, 'undo').name("Undo");
    group.add(hawalis, 'playMovie').name("Play Movie");
    group.add(hawalis, 'quitGame').name("Quit Game");
    group.add(hawalis, 'velocity', 1, 10).step(1).name("Speed");
    group.add(hawalis, 'gameDifficulty', {Easy: '1', Hard: '2'}).name("Difficulty");
    group.add(hawalis, 'gameMode', {'Player v Player': '1', 'Player v Bot': '2', 'Bot v Bot': '3'}).name("Mode");
    group.add(hawalis, 'getLogs').name("Log");
  }

  /**
   * Adds a list containing the IDs of the views passed as parameter.
   * @param {array} views
   */
  addViews(views) {
    var scene = this.scene;

    var viewsID = [];
    for (var key in views)
      viewsID.push(key);

    var controller = this.gui.add(this.scene, 'currentCamera', viewsID).name("Camera");

    controller.onChange(function(value) {
      scene.updateCamera(value);
    });
  }

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
