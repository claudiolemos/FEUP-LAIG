var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
* MySceneGraph class, representing the scene graph.
*/
class MySceneGraph {
  /**
  * @constructor
  */
  constructor(filename, scene) {
    this.loadedOk = null;

    // Establish bidirectional references between scene and graph.
    this.scene = scene;
    scene.graph = this;

    this.nodes = [];

    this.idRoot = null;                    // The id of the root element.

    this.axisCoords = [];
    this.axisCoords['x'] = [1, 0, 0];
    this.axisCoords['y'] = [0, 1, 0];
    this.axisCoords['z'] = [0, 0, 1];

    // File reading
    this.reader = new CGFXMLreader();

    /*
    * Read the contents of the xml file, and refer to this class for loading and error handlers.
    * After the file is read, the reader calls onXMLReady on this object.
    * If any error occurs, the reader calls onXMLError on this object, with an error message
    */

    this.reader.open('scenes/' + filename, this);
  }


  /*
  * Callback to be executed after successful reading
  */
  onXMLReady() {
    this.log("XML Loading finished.");
    var rootElement = this.reader.xmlDoc.documentElement;

    // Here should go the calls for different functions to parse the various blocks
    var error = this.parseXMLFile(rootElement);

    if (error != null) {
      this.onXMLError(error);
      return;
    }

    this.loadedOk = true;

    // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
    this.scene.onGraphLoaded();
  }

  /**
  * Parses the XML file, processing each block.
  * @param {XML root element} rootElement
  */
  parseXMLFile(rootElement) {
    if (rootElement.nodeName != "yas")
    return "root tag <yas> missing";

    var nodes = rootElement.children;

    // Reads the names of the nodes to an auxiliary buffer.
    var nodeNames = [];

    for (var i = 0; i < nodes.length; i++) {
      nodeNames.push(nodes[i].nodeName);
    }

    var error;

    // Processes each node, verifying errors.

    // <scene>
    var index;
    if ((index = nodeNames.indexOf("scene")) == -1)
    return "tag <scene> missing";
    else {
      if (index != SCENE_INDEX)
      this.onXMLMinorError("tag <scene> out of order");
      var node1 = nodeNames[5];

      //Parse scene block
      if ((error = this.parseScene(nodes[index])) != null)
      return error;
    }



    // <views>
    if ((index = nodeNames.indexOf("views")) == -1)
    return "tag <views> missing";
    else {
      if (index != VIEWS_INDEX)
      this.onXMLMinorError("tag <views> out of order");

      //Parse views block
      if ((error = this.parseViews(nodes[index])) != null)
      return error;
    }



    // <ambient>
    if ((index = nodeNames.indexOf("ambient")) == -1)
    return "tag <ambient> missing";
    else {
      if (index != AMBIENT_INDEX)
      this.onXMLMinorError("tag <ambient> out of order");

      //Parse ambient block
      if ((error = this.parseAmbient(nodes[index])) != null)
      return error;
    }

    // <lights>
    if ((index = nodeNames.indexOf("lights")) == -1)
    return "tag <lights> missing";
    else {
      if (index != LIGHTS_INDEX)
      this.onXMLMinorError("tag <lights> out of order");

      //Parse lights block
      if ((error = this.parseLights(nodes[index])) != null)
      return error;
    }




    // <textures>
    if ((index = nodeNames.indexOf("textures")) == -1)
    return "tag <textures> missing";
    else {
      if (index != TEXTURES_INDEX)
      this.onXMLMinorError("tag <textures> out of order");

      //Parse textures block
      if ((error = this.parseTextures(nodes[index])) != null)
      return error;
    }


    // <materials>
    if ((index = nodeNames.indexOf("materials")) == -1)
    return "tag <materials> missing";
    else {
      if (index != MATERIALS_INDEX)
      this.onXMLMinorError("tag <materials> out of order");

      //Parse textures block
      if ((error = this.parseMaterials(nodes[index])) != null)
      return error;
    }

    // <transformations>
    if ((index = nodeNames.indexOf("transformations")) == -1)
    return "tag <transformations> missing";
    else {
      if (index != TRANSFORMATIONS_INDEX)
      this.onXMLMinorError("tag <transformations> out of order");

      //Parse transformations block
      if ((error = this.parseTransformations(nodes[index])) != null)
      return error;
    }
    /*

    // <primitives>
    if ((index = nodeNames.indexOf("primitives")) == -1)
    return "tag <primitives> missing";
    else {
    if (index != PRIMITIVES_INDEX)
    this.onXMLMinorError("tag <primitives> out of order");

    //Parse primitives block
    if ((error = this.parsePrimitives(nodes[index])) != null)
    return error;
  }

  // <components>
  if ((index = nodeNames.indexOf("components")) == -1)
  return "tag <components> missing";
  else {
  if (index != COMPONENTS_INDEX)
  this.onXMLMinorError("tag <components> out of order");

  //Parse components block
  if ((error = this.parseComponents(nodes[index])) != null)
  return error;
}

*/
}

/**
* Parses the <scene> block.
*/
parseScene(sceneNode) {

  // Reads root and axis_length
  this.root = this.reader.getString(sceneNode, 'root');
  this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');

  // Validates root
  if(this.root == null){
    this.root = 'root';
    this.onXMLMinorError("unable to parse root component of the scene block; assuming root = 'root'");
  }

  // Validates axis_length
  if(this.axis_length != null){
    if(isNaN(this.axis_length))
    return "axis_length is a non numeric value on the scene block";
    else if(this.axis_length <= 0)
    return "axis_length should be a value greater than 0";
  }
  else {
    this.axis_length = 1;
    this.onXMLMinorError("unable to parse axis_length component of the scene block; assuming axis_length = 1");
  }

  this.log("Parsed scene");

  return null;
}

/**
* Parses the <views> block.
*/
parseViews(viewsNode) {

  var children = viewsNode.children;

  var nodeNames = [];

  for (var i = 0; i < children.length; i++)
  nodeNames.push(children[i].nodeName);

  // Reads default view (perspective or ortho)
  this.default = this.reader.getString(viewsNode, 'default');

  /*TODO NAO CONSIGO POR A COMPARACAO A FUNCIONAR
  if (this.default === 'perspective' || this.default === 'ortho') {
  this.default = '';
  this.onXMLMinorError("failed to parse default view; should be perspective or ortho");
}
*/

// Checks if there's at least one of the views
if (nodeNames.indexOf("perspective") == -1 && vnodeNames.indexOf("ortho")  == -1)
return "at least one view must be defined (perspective or ortho)";

// Gets indice of each view
var perspectiveIndex = nodeNames.indexOf("perspective");
var orthoIndex = nodeNames.indexOf("ortho");

// Creates variables
this.perspective = [];
this.ortho = []

// Reads perspective node
if(perspectiveIndex != -1){
  var perspectiveChildren = children[perspectiveIndex].children;

  var perspectiveNodeNames = [];

  for (var i = 0; i < perspectiveChildren.length; i++)
  perspectiveNodeNames.push(perspectiveChildren[i].nodeName);

  // Reads id, near far and angle
  this.perspectiveID = this.reader.getString(children[perspectiveIndex], 'id');
  this.perspectiveNear = this.reader.getFloat(children[perspectiveIndex], 'near');
  this.perspectiveFar = this.reader.getFloat(children[perspectiveIndex], 'far');
  this.perspectiveAngle = this.reader.getFloat(children[perspectiveIndex], 'angle');

  // Validates perspective variables
  if(this.perspectiveID == null || this.perspectiveNear == null || this.perspectiveFar == null || this.perspectiveAngle == null){
    this.perspectiveVars = ['',0,0,0];
    this.onXMLMinorError("failed to parse perspective variables; assuming zero");
  }
  else
  this.perspectiveVars = [this.perspectiveID, this.perspectiveNear, this.perspectiveFar, this.perspectiveAngle];

  // Creates variables
  this.from = [];
  this.to = []

  // Gets indices of each element (from & too)
  var fromIndex = perspectiveNodeNames.indexOf('from');
  var toIndex = perspectiveNodeNames.indexOf('to');

  if (fromIndex == -1)
  this.onXMLMinorError("from is undefined");
  else {
    var fx = this.reader.getFloat(perspectiveChildren[fromIndex], 'x');
    var fy = this.reader.getFloat(perspectiveChildren[fromIndex], 'y');
    var fz = this.reader.getFloat(perspectiveChildren[fromIndex], 'z');

    if(fx == null || fy == null || fz == null){
      fx = 0;
      fy = 0;
      fz = 0;
      this.onXMLMinorError("failed to parse from coordinates of perspective view; assuming zero");
    }

    this.from = [fx, fy, fz];
  }

  if (toIndex == -1)
  this.onXMLMinorError("to is undefined");
  else {
    var tx = this.reader.getFloat(perspectiveChildren[toIndex], 'x');
    var ty = this.reader.getFloat(perspectiveChildren[toIndex], 'y');
    var tz = this.reader.getFloat(perspectiveChildren[toIndex], 'z');

    if(tx == null || ty == null || tz == null){
      tx = 0;
      ty = 0;
      tz = 0;
      this.onXMLMinorError("failed to parse from coordinates of perspective view; assuming zero");
    }

    this.to = [tx, ty, tz];
  }

  this.perspective = [this.from, this.to];
}

//Reads ortho node
if(orthoIndex != -1){

  //Reads id, near, far, left, right and top
  this.orthoID = this.reader.getString(children[orthoIndex], 'id');
  this.orthoNear = this.reader.getFloat(children[orthoIndex], 'near');
  this.orthoFar = this.reader.getFloat(children[orthoIndex], 'far');
  this.orthoLeft = this.reader.getFloat(children[orthoIndex], 'left');
  this.orthoRight = this.reader.getFloat(children[orthoIndex], 'right');
  this.orthoTop = this.reader.getFloat(children[orthoIndex], 'top');
  this.orthoBottom = this.reader.getFloat(children[orthoIndex], 'bottom');

  if(this.orthoID == null || this.orthoNear == null || this.orthoFar == null || this.orthoLeft == null || this.orthoRight == null || this.orthoTop == null){
    this.orthoVars = ['',0,0,0,0,0,0];
    this.onXMLMinorError("failed to parse ortho variables; assuming zero");
  }
  else
  this.orthoVars = [this.orthoID, this.orthoNear, this.orthoFar, this.orthoLeft, this.orthoRight, this.orthoTop];
}

this.log("Parsed views");

return null;
}

/**
* Parses the <ambient> block.
*/
parseAmbient(ambientNode) {

  var children = ambientNode.children;

  var nodeNames = [];

  for (var i = 0; i < children.length; i++)
  nodeNames.push(children[i].nodeName);

  // Gets indice of ambient and background
  var ambientIndex = nodeNames.indexOf("ambient");
  var backgroundIndex = nodeNames.indexOf("background");

  if(ambientIndex != -1){
    var r = this.reader.getFloat(children[ambientIndex], 'r');
    var g = this.reader.getFloat(children[ambientIndex], 'g');
    var b = this.reader.getFloat(children[ambientIndex], 'b');
    var a = this.reader.getFloat(children[ambientIndex], 'a');

    if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
    return "rgba should be numeric values on the ambient node from the ambient block";
    else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
    return "rgba should be numeric values between 0 and 1 on the ambient node from the ambient block";

    if(r == null || g == null || b == null || a == null){
      this.ambient = [0,0,0,1]
      this.onXMLMinorError("unable to parse ambient; assuming (0,0,0,1)");
    }
    else
    this.ambient = [r,g,b,a];
  }
  else{
    this.ambient = [0,0,0,1]
    this.onXMLMinorError("ambient is not defined; assuming (0,0,0,1)");
  }

  if(backgroundIndex != -1){
    var r = this.reader.getFloat(children[backgroundIndex], 'r');
    var g = this.reader.getFloat(children[backgroundIndex], 'g');
    var b = this.reader.getFloat(children[backgroundIndex], 'b');
    var a = this.reader.getFloat(children[backgroundIndex], 'a');

    if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
    return "rgba should be numeric values on the background node from the ambient block";
    else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
    return "rgba should be numeric values between 0 and 1 on the background node from the ambient block";

    if(r == null || g == null || b == null || a == null){
      this.background = [0,0,0,1]
      this.onXMLMinorError("unable to parse background; assuming (0,0,0,1)");
    }
    else
    this.background = [r,g,b,a];

  }
  else{
    this.background = [0,0,0,1]
    this.onXMLMinorError("background is not defined; assuming (0,0,0,1)");
  }

  this.log("Parsed ambient");

  return null;

}

/**
* Parses the <lights> block.
*/
parseLights(lightsNode) {

  var children = lightsNode.children;

  var nodeNames = [];

  for (var i = 0; i < children.length; i++)
  nodeNames.push(children[i].nodeName);

  // Checks if there are lights defined
  if(lightsNode.getElementsByTagName('omni').length == 0 && lightsNode.getElementsByTagName('spot').length == 0)
  return "no lights are defined on the lights block";

  // Creates variables
  this.omni = [];
  this.spot = [];
  var omniCounter = 0;
  var spotCounter = 0;

  // Reads omni amd spot lights
  for (var i = 0; i < children.length; i++){
    if(children[i].nodeName == "omni"){
      var omniChildren = children[i].children;

      var omniNodeNames = [];

      for (var j = 0; j < omniChildren.length; j++)
      omniNodeNames.push(omniChildren[j].nodeName);

      this.omni[omniCounter] = [];

      var omniID = this.reader.getString(children[i], 'id');
      var omniEnabled = this.reader.getFloat(children[i], 'enabled');

      if(omniEnabled != 0 && omniEnabled != 1)
      return "enabled on the omni node from the lights block should be either 0 or 1";

      if(omniEnabled == null || omniID == null){
        omniID = "omni" + omniCounter;
        omniEnabled = 1;
        this.onXMLMinorError("couldn't parse id and enabled on the omni node from the lights block");
      }
      else{
        this.omni[omniCounter].id = omniID;
        this.omni[omniCounter].enabled = omniEnabled;
      }

      // Gets indice of location, ambient, diffuse and specular
      var locationIndex = omniNodeNames.indexOf("location");
      var ambientIndex = omniNodeNames.indexOf("ambient");
      var diffuseIndex = omniNodeNames.indexOf("diffuse");
      var specularIndex = omniNodeNames.indexOf("specular");

      // Location
      if(locationIndex != -1){
        var x = this.reader.getFloat(omniChildren[locationIndex], 'x');
        var y = this.reader.getFloat(omniChildren[locationIndex], 'y');
        var z = this.reader.getFloat(omniChildren[locationIndex], 'z');
        var w = this.reader.getFloat(omniChildren[locationIndex], 'w');

        if(isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w))
        return "location should be numeric values on the omni node from the lights block";

        if(x == null || y == null || z == null || w == null){
          this.omni[omniCounter].location = [0,0,0,1]
          this.onXMLMinorError("unable to parse omni location; assuming (0,0,0,1)");
        }
        else
        this.omni[omniCounter].location = [x,y,z,w]
      }
      else {
        this.omni[omniCounter].location = [0,0,0,1]
        this.onXMLMinorError("omni location is not defined; assuming (0,0,0,1)");
      }

      // Ambient
      if(ambientIndex != -1){
        var r = this.reader.getFloat(omniChildren[ambientIndex], 'r');
        var g = this.reader.getFloat(omniChildren[ambientIndex], 'g');
        var b = this.reader.getFloat(omniChildren[ambientIndex], 'b');
        var a = this.reader.getFloat(omniChildren[ambientIndex], 'a');

        if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
        return "ambient should be numeric values on the omni node from the lights block";
        else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
        return "rgba should be numeric values between 0 and 1 on the ambient node from the omni block";


        if(r == null || g == null || b == null || a == null){
          this.omni[omniCounter].ambient = [0,0,0,1]
          this.onXMLMinorError("unable to parse omni ambient; assuming (0,0,0,1)");
        }
        else
        this.omni[omniCounter].ambient = [r,g,b,a]
      }
      else {
        this.omni[omniCounter].ambient = [0,0,0,1]
        this.onXMLMinorError("omni ambient is not defined; assuming (0,0,0,1)");
      }

      // Diffuse
      if(ambientIndex != -1){
        var r = this.reader.getFloat(omniChildren[diffuseIndex], 'r');
        var g = this.reader.getFloat(omniChildren[diffuseIndex], 'g');
        var b = this.reader.getFloat(omniChildren[diffuseIndex], 'b');
        var a = this.reader.getFloat(omniChildren[diffuseIndex], 'a');

        if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
        return "diffuse should be numeric values on the omni node from the lights block";
        else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
        return "rgba should be numeric values between 0 and 1 on the diffuse node from the omni block";

        if(r == null || g == null || b == null || a == null){
          this.omni[omniCounter].diffuse = [0,0,0,1]
          this.onXMLMinorError("unable to parse omni diffuse; assuming (0,0,0,1)");
        }
        else
        this.omni[omniCounter].diffuse = [r,g,b,a]
      }
      else {
        this.omni[omniCounter].diffuse = [0,0,0,1]
        this.onXMLMinorError("omni diffuse is not defined; assuming (0,0,0,1)");
      }

      // Specular
      if(specularIndex != -1){
        var r = this.reader.getFloat(omniChildren[specularIndex], 'r');
        var g = this.reader.getFloat(omniChildren[specularIndex], 'g');
        var b = this.reader.getFloat(omniChildren[specularIndex], 'b');
        var a = this.reader.getFloat(omniChildren[specularIndex], 'a');

        if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
        return "specular should be numeric values on the omni node from the lights block";
        else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
        return "rgba should be numeric values between 0 and 1 on the specular node from the omni block";

        if(r == null || g == null || b == null || a == null){
          this.omni[omniCounter].specular = [0,0,0,1]
          this.onXMLMinorError("unable to parse omni specular; assuming (0,0,0,1)");
        }
        else
        this.omni[omniCounter].specular = [r,g,b,a]
      }
      else {
        this.omni[omniCounter].specular = [0,0,0,1]
        this.onXMLMinorError("omni specular is not defined; assuming (0,0,0,1)");
      }

      omniCounter++;
    }
    else if(children[i].nodeName == "spot"){
      var spotChildren = children[i].children;

      var spotNodeNames = [];

      for (var j = 0; j < spotChildren.length; j++)
      spotNodeNames.push(spotChildren[j].nodeName);

      this.spot[spotCounter] = [];

      var spotID = this.reader.getString(children[i], 'id');
      var spotEnabled = this.reader.getFloat(children[i], 'enabled');
      var spotAngle = this.reader.getFloat(children[i], 'angle');
      var spotExponent = this.reader.getFloat(children[i], 'exponent');

      if(spotEnabled != 0 && spotEnabled != 1)
      return "enabled on the spot node from the lights block should be either 0 or 1";

      if(spotEnabled == null || spotID == null || spotAngle == null || spotExponent == null){
        spotID = "spot" + omniCounter;
        spotEnabled = 1;
        spotAngle = 0;
        spotExponent = 1;
        this.onXMLMinorError("couldn't parse id, enabled, angle and exponent on the spot node from the lights block");
      }
      else{
        this.spot[spotCounter].id = spotID;
        this.spot[spotCounter].enabled = spotEnabled;
        this.spot[spotCounter].angle = spotAngle;
        this.spot[spotCounter].exponent = spotExponent;
      }

      // Gets indice of location, target ambient, diffuse and specular
      var locationIndex = spotNodeNames.indexOf("location");
      var targetIndex = spotNodeNames.indexOf("target");
      var ambientIndex = spotNodeNames.indexOf("ambient");
      var diffuseIndex = spotNodeNames.indexOf("diffuse");
      var specularIndex = spotNodeNames.indexOf("specular");

      // Location
      if(locationIndex != -1){
        var x = this.reader.getFloat(spotChildren[locationIndex], 'x');
        var y = this.reader.getFloat(spotChildren[locationIndex], 'y');
        var z = this.reader.getFloat(spotChildren[locationIndex], 'z');
        var w = this.reader.getFloat(spotChildren[locationIndex], 'w');

        if(isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w))
        return "location should be numeric values on the spot node from the lights block";

        if(x == null || y == null || z == null || w == null){
          this.spot[spotCounter].location = [0,0,0,1]
          this.onXMLMinorError("unable to parse spot location; assuming (0,0,0,1)");
        }
        else
        this.spot[spotCounter].location = [x,y,z,w]
      }
      else {
        this.spot[spotCounter].location = [0,0,0,1]
        this.onXMLMinorError("spot location is not defined; assuming (0,0,0,1)");
      }

      // Target
      if(targetIndex != -1){
        var x = this.reader.getFloat(spotChildren[targetIndex], 'x');
        var y = this.reader.getFloat(spotChildren[targetIndex], 'y');
        var z = this.reader.getFloat(spotChildren[targetIndex], 'z');

        if(isNaN(x) || isNaN(y) || isNaN(z))
        return "target should be numeric values on the spot node from the lights block";

        if(x == null || y == null || z == null){
          this.spot[spotCounter].target = [0,0,0]
          this.onXMLMinorError("unable to parse spot location; assuming (0,0,0)");
        }
        else
        this.spot[spotCounter].target = [x,y,z]
      }
      else {
        this.spot[spotCounter].target = [0,0,0]
        this.onXMLMinorError("spot location is not defined; assuming (0,0,0)");
      }

      // Ambient
      if(ambientIndex != -1){
        var r = this.reader.getFloat(spotChildren[ambientIndex], 'r');
        var g = this.reader.getFloat(spotChildren[ambientIndex], 'g');
        var b = this.reader.getFloat(spotChildren[ambientIndex], 'b');
        var a = this.reader.getFloat(spotChildren[ambientIndex], 'a');

        if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
        return "ambient should be numeric values on the spot node from the lights block";
        else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
        return "rgba should be numeric values between 0 and 1 on the spot node from the omni block";


        if(r == null || g == null || b == null || a == null){
          this.spot[spotCounter].ambient = [0,0,0,1]
          this.onXMLMinorError("unable to parse spot ambient; assuming (0,0,0,1)");
        }
        else
        this.spot[spotCounter].ambient = [r,g,b,a]
      }
      else {
        this.spot[spotCounter].ambient = [0,0,0,1]
        this.onXMLMinorError("spot ambient is not defined; assuming (0,0,0,1)");
      }

      // Diffuse
      if(diffuseIndex != -1){
        var r = this.reader.getFloat(spotChildren[diffuseIndex], 'r');
        var g = this.reader.getFloat(spotChildren[diffuseIndex], 'g');
        var b = this.reader.getFloat(spotChildren[diffuseIndex], 'b');
        var a = this.reader.getFloat(spotChildren[diffuseIndex], 'a');

        if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
        return "diffuse should be numeric values on the spot node from the lights block";
        else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
        return "rgba should be numeric values between 0 and 1 on the spot node from the omni block";


        if(r == null || g == null || b == null || a == null){
          this.spot[spotCounter].diffuse = [0,0,0,1]
          this.onXMLMinorError("unable to parse spot diffuse; assuming (0,0,0,1)");
        }
        else
        this.spot[spotCounter].diffuse = [r,g,b,a]
      }
      else {
        this.spot[spotCounter].diffuse = [0,0,0,1]
        this.onXMLMinorError("spot diffuse is not defined; assuming (0,0,0,1)");
      }

      // Specular
      if(specularIndex != -1){
        var r = this.reader.getFloat(spotChildren[specularIndex], 'r');
        var g = this.reader.getFloat(spotChildren[specularIndex], 'g');
        var b = this.reader.getFloat(spotChildren[specularIndex], 'b');
        var a = this.reader.getFloat(spotChildren[specularIndex], 'a');

        if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
        return "specular should be numeric values on the spot node from the lights block";
        else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
        return "rgba should be numeric values between 0 and 1 on the spot node from the omni block";


        if(r == null || g == null || b == null || a == null){
          this.spot[spotCounter].specular = [0,0,0,1]
          this.onXMLMinorError("unable to parse spot specular; assuming (0,0,0,1)");
        }
        else
        this.spot[spotCounter].specular = [r,g,b,a]
      }
      else {
        this.spot[spotCounter].specular = [0,0,0,1]
        this.onXMLMinorError("spot specular is not defined; assuming (0,0,0,1)");
      }
      spotCounter++;
    }
  }

  this.log("Parsed lights");
  return null;
}

/**
* Parses the <textures> block.
*/
parseTextures(texturesNode) {

  var children = texturesNode.children;

  var nodeNames = [];

  for (var i = 0; i < children.length; i++)
  nodeNames.push(children[i].nodeName);

  this.textures = [];

  // Checks if there are textures defined
  if(texturesNode.getElementsByTagName('texture').length == 0)
  return "no textures are defined on the textures block";

  // Creates variables
  var textureCounter = 0;

  for (var i = 0; i < children.length; i++){

    this.textures[textureCounter] = [];

    var id = this.reader.getString(children[i], 'id');
    var file = this.reader.getString(children[i], 'file');

    // Verifies if the id is unique
    for(var j = 0; j < this.textures.length; j++){
      if(id == this.textures[j].id)
      return "there can't be two textures with the same id";
    }

    this.textures[textureCounter].id = id;
    this.textures[textureCounter].file = file;

    textureCounter++;
  }

  this.log("Parsed textures");
  return null;
}

/**
* Parses the <materials> block.
*/
parseMaterials(materialsNode) {
  var children = materialsNode.children;

  var nodeNames = [];

  for (var i = 0; i < children.length; i++)
  nodeNames.push(children[i].nodeName);

  // Checks if there are materials defined
  if(materialsNode.getElementsByTagName('material').length == 0)
  return "no materials are defined on the materials block";

  // Creates variables
  this.materials = [];
  var materialCounter = 0;

  for (var i = 0; i < children.length; i++){
    var materialsChildren = children[i].children;

    var materialsNodeNames = [];

    for (var j = 0; j < materialsChildren.length; j++)
    materialsNodeNames.push(materialsChildren[j].nodeName);

    this.materials[materialCounter] = [];

    var id = this.reader.getString(children[i], 'id');
    var shininess = this.reader.getFloat(children[i], 'shininess');

    // Verifies if the id is unique
    for(var j = 0; j < this.materials.length; j++){
      if(id == this.materials[j].id)
      return "there can't be two materials with the same id";
    }

    this.materials[materialCounter].id = id;
    this.materials[materialCounter].shininess = shininess;

    // Gets indice of emission, ambient, diffuse and specular
    var emissionIndex = materialsNodeNames.indexOf("emission");
    var ambientIndex = materialsNodeNames.indexOf("ambient");
    var diffuseIndex = materialsNodeNames.indexOf("diffuse");
    var specularIndex = materialsNodeNames.indexOf("specular");

    // Emission
    if(emissionIndex != -1){
      var r = this.reader.getFloat(materialsChildren[emissionIndex], 'r');
      var g = this.reader.getFloat(materialsChildren[emissionIndex], 'g');
      var b = this.reader.getFloat(materialsChildren[emissionIndex], 'b');
      var a = this.reader.getFloat(materialsChildren[emissionIndex], 'a');

      if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
      return "emission should be numeric values on the omni node from the material block";
      else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
      return "rgba should be numeric values between 0 and 1 on the emission node from the material block";


      if(r == null || g == null || b == null || a == null){
        this.materials[materialCounter].emission = [0,0,0,1]
        this.onXMLMinorError("unable to parse material emission; assuming (0,0,0,1)");
      }
      else
      this.materials[materialCounter].emission = [r,g,b,a]
    }
    else {
      this.materials[materialCounter].emission = [0,0,0,1]
      this.onXMLMinorError("material emission is not defined; assuming (0,0,0,1)");
    }

    // Ambient
    if(ambientIndex != -1){
      var r = this.reader.getFloat(materialsChildren[ambientIndex], 'r');
      var g = this.reader.getFloat(materialsChildren[ambientIndex], 'g');
      var b = this.reader.getFloat(materialsChildren[ambientIndex], 'b');
      var a = this.reader.getFloat(materialsChildren[ambientIndex], 'a');

      if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
      return "ambient should be numeric values on the omni node from the material block";
      else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
      return "rgba should be numeric values between 0 and 1 on the ambient node from the material block";


      if(r == null || g == null || b == null || a == null){
        this.materials[materialCounter].ambient = [0,0,0,1]
        this.onXMLMinorError("unable to parse material ambient; assuming (0,0,0,1)");
      }
      else
      this.materials[materialCounter].ambient = [r,g,b,a]
    }
    else {
      this.materials[materialCounter].ambient = [0,0,0,1]
      this.onXMLMinorError("material ambient is not defined; assuming (0,0,0,1)");
    }

    // Diffuse
    if(diffuseIndex != -1){
      var r = this.reader.getFloat(materialsChildren[diffuseIndex], 'r');
      var g = this.reader.getFloat(materialsChildren[diffuseIndex], 'g');
      var b = this.reader.getFloat(materialsChildren[diffuseIndex], 'b');
      var a = this.reader.getFloat(materialsChildren[diffuseIndex], 'a');

      if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
      return "diffuse should be numeric values on the omni node from the material block";
      else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
      return "rgba should be numeric values between 0 and 1 on the diffuse node from the material block";


      if(r == null || g == null || b == null || a == null){
        this.materials[materialCounter].diffuse = [0,0,0,1]
        this.onXMLMinorError("unable to parse material diffuse; assuming (0,0,0,1)");
      }
      else
      this.materials[materialCounter].diffuse = [r,g,b,a]
    }
    else {
      this.materials[materialCounter].diffuse = [0,0,0,1]
      this.onXMLMinorError("material diffuse is not defined; assuming (0,0,0,1)");
    }

    // Specular
    if(specularIndex != -1){
      var r = this.reader.getFloat(materialsChildren[specularIndex], 'r');
      var g = this.reader.getFloat(materialsChildren[specularIndex], 'g');
      var b = this.reader.getFloat(materialsChildren[specularIndex], 'b');
      var a = this.reader.getFloat(materialsChildren[specularIndex], 'a');

      if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
      return "specular should be numeric values on the omni node from the material block";
      else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
      return "rgba should be numeric values between 0 and 1 on the specular node from the material block";


      if(r == null || g == null || b == null || a == null){
        this.materials[materialCounter].specular = [0,0,0,1]
        this.onXMLMinorError("unable to parse material specular; assuming (0,0,0,1)");
      }
      else
      this.materials[materialCounter].specular = [r,g,b,a]
    }
    else {
      this.materials[materialCounter].specular = [0,0,0,1]
      this.onXMLMinorError("material specular is not defined; assuming (0,0,0,1)");
    }

    materialCounter++;
  }

  this.log("Parsed materials");
  return null;
}

/**
* Parses the <transformations> block.
*/
parseTransformations(transformationsNode) {
  var children = transformationsNode.children;

  var nodeNames = [];

  for (var i = 0; i < children.length; i++)
  nodeNames.push(children[i].nodeName);

  // Checks if there are transformations defined
  if(transformationsNode.getElementsByTagName('transformation').length == 0)
  return "no transformations are defined on the transformations block";

  // Creates variables
  this.transformations = [];
  var transformationCounter = 0;

  for (var i = 0; i < children.length; i++){
    var transformationChildren = children[i].children;

    var transformationNodeNames = [];

    for (var j = 0; j < transformationChildren.length; j++)
    transformationNodeNames.push(transformationChildren[j].nodeName);

    // Checks if there are given instructions
    if(transformationChildren.length == 0)
    return "no transformation instructions are defined on the transformations block";

    this.transformations[transformationCounter] = [];

    var id = this.reader.getString(children[i], 'id');

    // Verifies if the id is unique
    for(var j = 0; j < this.transformations.length; j++){
      if(id == this.transformations[j].id)
      return "there can't be two transformations with the same id";
    }

    this.transformations[transformationCounter].id = id;

    // Create variables
    this.transformations[transformationCounter].translate = [];
    this.transformations[transformationCounter].rotate = [];
    this.transformations[transformationCounter].scale = [];
    var translateCounter = 0;
    var rotateCounter = 0;
    var scaleCounter = 0;

    for (var j = 0; j < transformationChildren.length; j++){

      if(transformationChildren[j].nodeName == "translate"){
        this.transformations[transformationCounter].translate[translateCounter] = [];

        var x = this.reader.getFloat(transformationChildren[j], 'x');
        var y = this.reader.getFloat(transformationChildren[j], 'y');
        var z = this.reader.getFloat(transformationChildren[j], 'z');


        if(isNaN(x) || isNaN(y) || isNaN(z))
        return "translation should be numeric values on the transformation node from the transformations block";

        if(x == null || y == null || z == null){
          this.transformations[transformationCounter].translate[translateCounter].x = 0;
          this.transformations[transformationCounter].translate[translateCounter].y = 0;
          this.transformations[transformationCounter].translate[translateCounter].z = 0;
          this.onXMLMinorError("unable to parse transformation translation; assuming (0,0,0)");
        }
        else{
          this.transformations[transformationCounter].translate[translateCounter].x = x;
          this.transformations[transformationCounter].translate[translateCounter].y = y;
          this.transformations[transformationCounter].translate[translateCounter].z = z;
        }

        translateCounter++;
      }
      else if(transformationChildren[j].nodeName == "rotate"){
        this.transformations[transformationCounter].rotate[rotateCounter] = [];

        var axis = this.reader.getString(transformationChildren[j], 'axis');
        var angle = this.reader.getFloat(transformationChildren[j], 'angle');

        if(isNaN(angle))
        return "rotation angle should be numeric values on the transformation node from the transformations block";
        else if(angle < 0 || angle > 360)
        return "rotation angle should be a numeric value between 0 and 360"
        else if(axis != "x" && axis != "y" && axis != "z")
        return "rotation axis should be x, y or z";

        if(axis == null || angle == null){
          this.transformations[transformationCounter].rotate[rotateCounter].axis = "x";
          this.transformations[transformationCounter].rotate[rotateCounter].angle = 0;
          this.onXMLMinorError("unable to parse transformation rotation; assuming axis=x and angle=0");
        }
        else{
          this.transformations[transformationCounter].rotate[rotateCounter].axis = axis;
          this.transformations[transformationCounter].rotate[rotateCounter].angle = angle;
        }

        rotateCounter++;
      }
      else if(transformationChildren[j].nodeName == "scale"){
        this.transformations[transformationCounter].scale[scaleCounter] = [];

        var x = this.reader.getFloat(transformationChildren[j], 'x');
        var y = this.reader.getFloat(transformationChildren[j], 'y');
        var z = this.reader.getFloat(transformationChildren[j], 'z');

        if(isNaN(x) || isNaN(y) || isNaN(z))
          return "scaling should be numeric values on the transformation node from the transformations block";


        if(x == null || y == null || z == null){
          this.transformations[transformationCounter].scale[scaleCounter].x = 0;
          this.transformations[transformationCounter].scale[scaleCounter].y = 0;
          this.transformations[transformationCounter].scale[scaleCounter].z = 0;
          this.onXMLMinorError("unable to parse transformation scaling; assuming (0,0,0)");
        }
        else{
          this.transformations[transformationCounter].scale[scaleCounter].x = x;
          this.transformations[transformationCounter].scale[scaleCounter].y = y;
          this.transformations[transformationCounter].scale[scaleCounter].z = z;
        }

        scaleCounter++;
      }

    }

    transformationCounter++;
  }

  this.log("Parsed transformations");
  return null;
}

/**
* Parses the <primitives> block.
*/
parsePrimitives(primitivesNode) {
  this.log("Parsed primitives");
  return null;
}

/**
* Parses the <components> block.
*/
parseComponents(componentsNode) {
  this.log("Parsed components");
  return null;
}

/*
* Callback to be executed on any read error, showing an error on the console.
* @param {string} message
*/
onXMLError(message) {
  console.error("XML Loading Error: " + message);
  this.loadedOk = false;
}

/**
* Callback to be executed on any minor error, showing a warning on the console.
* @param {string} message
*/
onXMLMinorError(message) {
  console.warn("Warning: " + message);
}


/**
* Callback to be executed on any message.
* @param {string} message
*/
log(message) {
  console.log("   " + message);
}

/**
* Displays the scene, processing each node, starting in the root node.
*/
displayScene() {
  // entry point for graph rendering
  //TODO: Render loop starting at root of graph
}
}
