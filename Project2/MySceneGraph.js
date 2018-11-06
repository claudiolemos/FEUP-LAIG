var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

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

    // <primitives>
    if ((index = nodeNames.indexOf("animations")) == -1)
    return "tag <animations> missing";
    else {
      if (index != ANIMATIONS_INDEX)
      this.onXMLMinorError("tag <animations> out of order");

      //Parse animations block
      if ((error = this.parseAnimations(nodes[index])) != null)
      return error;
    }

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
  }

  /**
  * Parses the <scene> block.
  * @param {array} sceneNode
  */
  parseScene(sceneNode) {
    // Reads root and axis length
    var root = this.reader.getString(sceneNode, 'root');
    var axis_length = this.reader.getFloat(sceneNode, 'axis_length');

    // Validates root
    if(root == null)
    return "unable to parse root component (null) on the <scene> block"

    // Validates axis_length
    if(axis_length == null)
    return "unable to parse axis_length component (null) on the <scene> block"
    else if(isNaN(axis_length))
    return "unable to parse axis_length component (NaN) on the <scene> block"
    else if(axis_length <= 0)
    return "unable to parse axis_length component (less than or equal to 0) on the <scene> block"

    // Sets root and axis length values
    this.root = root;
    this.axis_length = axis_length;

    this.log("Parsed scene");

    return null;
  }

  /**
  * Parses the <views> block.
  * @param {array} viewsNode
  */
  parseViews(viewsNode) {
    // Reads views children and node names
    var children = viewsNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Initializes views
    this.views = [];

    // Checks if there's at least one of the views (perspective or ortho)
    if(viewsNode.getElementsByTagName('perspective').length == 0 && viewsNode.getElementsByTagName('ortho').length == 0)
    return "at least one view must be defined (either <perspective> or <ortho>) on the <views> block";

    // Creates variables
    this.views = [];

    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "perspective"){
        // Reads perspective node children and node names
        var perspectiveChildren = children[i].children;
        var perspectiveNodeNames = [];
        for (var j = 0; j < perspectiveChildren.length; j++)
        perspectiveNodeNames.push(perspectiveChildren[j].nodeName);

        // Reads id, near far, angle
        var id = this.reader.getString(children[i], 'id');
        var near = this.reader.getFloat(children[i], 'near');
        var far = this.reader.getFloat(children[i], 'far');
        var angle = this.reader.getFloat(children[i], 'angle');

        // Validates id, near, far, angle
        if(id == null || near == null || far == null || angle == null)
        return "unable to parse id, near, far, angle components (null) on the <perspective> node with index " + i + " from the <views> block";
        else if(isNaN(near) || isNaN(far) || isNaN(angle))
        return "unable to parse near, far, angle components (NaN) on the <perspective> node with index " + i + " from the <views> block";

        // Checks if id is unique
        if(this.views[id] != null)
          return "id '" + id + "' on the <perspective> node with index " + i + " from the <views> block is not unique";

        // Sets id, near, far, angle
        this.views[id] = [];
        this.views[id].type = "perspective"
        this.views[id].near = near;
        this.views[id].far = far;
        this.views[id].angle = angle * DEGREE_TO_RAD;

        // Creates from and to variables
        this.views[id].from = [];
        this.views[id].to = []

        // Gets indexes of each element (from & too)
        var fromIndex = perspectiveNodeNames.indexOf('from');
        var toIndex = perspectiveNodeNames.indexOf('to');

        // Reads from and to nodes
        if(fromIndex != -1){
          // Reads x, y, z values
          var x = this.reader.getFloat(perspectiveChildren[fromIndex], 'x');
          var y = this.reader.getFloat(perspectiveChildren[fromIndex], 'y');
          var z = this.reader.getFloat(perspectiveChildren[fromIndex], 'z');

          // Validates x, y, z values
          if(x == null || y == null || z == null)
          return "unable to parse x, y, z components (null) on tag <from> from the <perspective> node with index " + i + " from the <views> block";
          else if(isNaN(x) || isNaN(y) || isNaN(z))
          return "unable to parse x, y, z components (NaN) on tag <from> from the <perspective> node with index " + i + " from the <views> block";

          // Sets x, y, z values
          this.views[id].from.x = x;
          this.views[id].from.y = y;
          this.views[id].from.z = z;
        }
        else
        return "tag <from> is not defined on the <perspective> node with index " + i + " from the <views> block";

        if(toIndex != -1){
          // Reads x, y, z values
          var x = this.reader.getFloat(perspectiveChildren[toIndex], 'x');
          var y = this.reader.getFloat(perspectiveChildren[toIndex], 'y');
          var z = this.reader.getFloat(perspectiveChildren[toIndex], 'z');

          // Validates x, y, z values
          if(x == null || y == null || z == null)
          return "unable to parse x, y, z components (null) on tag <to> from the <perspective> node with index " + i + " from the <views> block";
          else if(isNaN(x) || isNaN(y) || isNaN(z))
          return "unable to parse x, y, z components (NaN) on tag <to> from the <perspective> node with index " + i + " from the <views> block";

          // Sets x, y, z values
          this.views[id].to.x = x;
          this.views[id].to.y = y;
          this.views[id].to.z = z;
        }
        else
        return "tag <to> is not defined on the <perspective> node with index " + i + " from the <views> block";
      }
      else if(children[i].nodeName == "ortho"){
        // Reads ortho node children and node names
        var orthoChildren = children[i].children;
        var orthoNodeNames = [];
        for (var j = 0; j < orthoChildren.length; j++)
        orthoNodeNames.push(orthoChildren[j].nodeName);

        // Reads id, near far, left, right, top, bottom
        var id = this.reader.getString(children[i], 'id');
        var near = this.reader.getFloat(children[i], 'near');
        var far = this.reader.getFloat(children[i], 'far');
        var left = this.reader.getFloat(children[i], 'left');
        var right = this.reader.getFloat(children[i], 'right');
        var top = this.reader.getFloat(children[i], 'top');
        var bottom = this.reader.getFloat(children[i], 'bottom');

        // Validates id, near far, left, right, top, bottom
        if(id == null || near == null || far == null || left == null || right == null || top == null || bottom == null)
        return "unable to parse id, near far, left, right, top, bottom components (null) on the <ortho> node with index " + i + " from the <views> block";
        else if(isNaN(near) || isNaN(far) || isNaN(left) || isNaN(right) || isNaN(top) || isNaN(bottom))
        return "unable to parse near far, left, right, top, bottom components (NaN) on the <ortho> node with index " + i + " from the <views> block";

        // Checks if id is unique
        if(this.views[id] != null)
          return "id '" + id + "' on the <ortho> node with index " + i + " from the <views> block is not unique";

        // Sets id, near far, left, right, top, bottom
        this.views[id] = [];
        this.views[id].type = "ortho";
        this.views[id].near = near;
        this.views[id].far = far;
        this.views[id].left = left;
        this.views[id].right = right;
        this.views[id].top = top;
        this.views[id].bottom = bottom;

        // Creates from and to variables
        this.views[id].from = [];
        this.views[id].to = []

        // Gets indexes of each element (from & too)
        var fromIndex = orthoNodeNames.indexOf('from');
        var toIndex = orthoNodeNames.indexOf('to');

        // Reads from and to nodes
        if(fromIndex != -1){
          // Reads x, y, z values
          var x = this.reader.getFloat(orthoChildren[fromIndex], 'x');
          var y = this.reader.getFloat(orthoChildren[fromIndex], 'y');
          var z = this.reader.getFloat(orthoChildren[fromIndex], 'z');

          // Validates x, y, z values
          if(x == null || y == null || z == null)
          return "unable to parse x, y, z components (null) on tag <from> from the <ortho> node with index " + i + " from the <views> block";
          else if(isNaN(x) || isNaN(y) || isNaN(z))
          return "unable to parse x, y, z components (NaN) on tag <from> from the <ortho> node with index " + i + " from the <views> block";

          // Sets x, y, z values
          this.views[id].from.x = x;
          this.views[id].from.y = y;
          this.views[id].from.z = z;
        }
        else
        return "tag <from> is not defined on the <ortho> node with index " + i + " from the <views> block";

        if(toIndex != -1){
          // Reads x, y, z values
          var x = this.reader.getFloat(orthoChildren[toIndex], 'x');
          var y = this.reader.getFloat(orthoChildren[toIndex], 'y');
          var z = this.reader.getFloat(orthoChildren[toIndex], 'z');

          // Validates x, y, z values
          if(x == null || y == null || z == null)
          return "unable to parse x, y, z components (null) on tag <to> from the <ortho> node with index " + i + " from the <views> block";
          else if(isNaN(x) || isNaN(y) || isNaN(z))
          return "unable to parse x, y, z components (NaN) on tag <to> from the <ortho> node with index " + i + " from the <views> block";

          // Sets x, y, z values
          this.views[id].to.x = x;
          this.views[id].to.y = y;
          this.views[id].to.z = z;
        }
        else
        return "tag <to> is not defined on the <ortho> node with index " + i + " from the <views> block";
      }
      else
        return "<" + children[j].nodeName + "> node with index " + i + " is not valid on the <views> block";
    }

    // Reads default view
    var defaultView = this.reader.getString(viewsNode, "default");

    // Finds and sets default view
    if(this.views[defaultView] != null)
      this.default = defaultView;
    else
      return "default id is not valid on the <views> block";

    this.log("Parsed views");

    return null;
  }

  /**
  * Parses the <ambient> block.
  * @param {array} ambientNode
  */
  parseAmbient(ambientNode) {

    // Reads ambient children and node names
    var children = ambientNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Gets indexes of ambient and background
    var ambientIndex = nodeNames.indexOf("ambient");
    var backgroundIndex = nodeNames.indexOf("background");

    // Creates variables
    this.ambient = [];
    this.background = [];

    //Reads ambient node
    if(ambientIndex != -1){
      // Reads r, g, b, a
      var r = this.reader.getFloat(children[ambientIndex], 'r');
      var g = this.reader.getFloat(children[ambientIndex], 'g');
      var b = this.reader.getFloat(children[ambientIndex], 'b');
      var a = this.reader.getFloat(children[ambientIndex], 'a');

      // Validates r, g, b, a values
      if(r == null || g == null || b == null || a == null)
      return "unable to parse r, g, b, a components (null) on the <ambient> node from the <ambient> block";
      else if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
      return "unable to parse r, g, b, a components (NaN) on the <ambient> node from the <ambient> block";
      else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
      return "unable to parse r, g, b, a components (out of 0.0-1.0 range) on the <ambient> node from the <ambient> block";

      // Sets r, g, b, a
      this.ambient.r = r;
      this.ambient.g = g;
      this.ambient.b = b;
      this.ambient.a = a;
    }
    else
    return "<ambient> node is not defined on the <ambient> block";

    //Reads background node
    if(backgroundIndex != -1){
      // Reads r, g, b, a
      var r = this.reader.getFloat(children[backgroundIndex], 'r');
      var g = this.reader.getFloat(children[backgroundIndex], 'g');
      var b = this.reader.getFloat(children[backgroundIndex], 'b');
      var a = this.reader.getFloat(children[backgroundIndex], 'a');

      // Validates r, g, b, a values
      if(r == null || g == null || b == null || a == null)
      return "unable to parse r, g, b, a components (null) on the <background> node from the <ambient> block";
      else if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
      return "unable to parse r, g, b, a components (NaN) on the <background> node from the <ambient> block";
      else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
      return "unable to parse r, g, b, a components (out of 0.0-1.0 range) on the <background> node from the <ambient> block";

      // Sets r, g, b, a
      this.background.r = r;
      this.background.g = g;
      this.background.b = b;
      this.background.a = a;
    }
    else
    return "<background> node is not defined on the <ambient> block";

    this.log("Parsed ambient");

    return null;

  }

  /**
  * Parses the <lights> block.
  * @param {array} lightsNode
  */
  parseLights(lightsNode) {

    // Reads lights children and node names
    var children = lightsNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Checks if there are any lights defined
    if(lightsNode.getElementsByTagName('omni').length == 0 && lightsNode.getElementsByTagName('spot').length == 0)
    return "at least one light must be defined (either <omni> or <spot>) on the <lights> block";

    // Checks if there are more than 8 lights defined
    if(children.length > 8)
    return "no more than 8 lights can be defined on the <lights> block due to WebGL limits";

    // Creates variables
    this.lights = [];

    // Reads omni amd spot lights
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "omni"){
        // Reads omni children and node names
        var omniChildren = children[i].children;
        var omniNodeNames = [];
        for (var j = 0; j < omniChildren.length; j++)
        omniNodeNames.push(omniChildren[j].nodeName);

        // Reads id and enabled
        var id = this.reader.getString(children[i], 'id');
        var enabled = this.reader.getFloat(children[i], 'enabled');

        // Validates id and enabled
        if(id == null || enabled == null)
        return "unable to parse id and enabled components (null) on the <omni> node with index " + i + " from the <lights> block";
        else if(isNaN(enabled))
        return "unable to parse enabled component (NaN) on the <omni> node with index " + i + " from the <lights> block";
        else if(enabled != 0 && enabled != 1)
        return "unable to parse enabled component (not valid - should be 0 or 1) on the <omni> node with index " + i + " from the <lights> block";

        // Checks if id is unique
        if(this.lights[id] != null)
        return "id '" + id + "' on the <omni> node with index " + i + " from the <lights> block is not unique";

        // Sets id and enabled
        this.lights[id] = [];
        this.lights[id].type = "omni";
        this.lights[id].enabled = enabled? true : false;

        // Gets indexes of location, ambient, diffuse and specular
        var locationIndex = omniNodeNames.indexOf("location");
        var ambientIndex = omniNodeNames.indexOf("ambient");
        var diffuseIndex = omniNodeNames.indexOf("diffuse");
        var specularIndex = omniNodeNames.indexOf("specular");

        // Reads location tag
        if(locationIndex != -1){
          // Creates variable
          this.lights[id].location = [];

          // Reads x, y, z,, w
          var x = this.reader.getFloat(omniChildren[locationIndex], 'x');
          var y = this.reader.getFloat(omniChildren[locationIndex], 'y');
          var z = this.reader.getFloat(omniChildren[locationIndex], 'z');
          var w = this.reader.getFloat(omniChildren[locationIndex], 'w');

          // Validates x, y, z,, w
          if(isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w))
          return "unable to parse x, y, z, w component (NaN) on tag <location> from the <omni> node with index " + i + " from the <lights> block";
          else if(x == null || y == null || z == null || w == null)
          return "unable to parse x, y, z, w component (null) on tag <location> from the <omni> node with index " + i + " from the <lights> block";

          // Sets x, y, z, w
          this.lights[id].location.x = x;
          this.lights[id].location.y = y;
          this.lights[id].location.z = z;
          this.lights[id].location.w = w;
        }
        else
        return "tag <location> is not defined on the <omni> node with index " + i + " from the <lights> block";

        // Reads ambient tag
        if(ambientIndex != -1){
          // Creates variable
          this.lights[id].ambient = [];

          // Reads r, g, b, a
          var r = this.reader.getFloat(omniChildren[ambientIndex], 'r');
          var g = this.reader.getFloat(omniChildren[ambientIndex], 'g');
          var b = this.reader.getFloat(omniChildren[ambientIndex], 'b');
          var a = this.reader.getFloat(omniChildren[ambientIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <ambient> from the <omni> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <ambient> from the <omni> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <ambient> from the <omni> node with index " + i + " from the <lights> block";

          // Sets r, g, b, a
          this.lights[id].ambient.r = r;
          this.lights[id].ambient.g = g;
          this.lights[id].ambient.b = b;
          this.lights[id].ambient.a = a;
        }
        else
        return "tag <ambient> is not defined on the <omni> node with index " + i + " from the <lights> block";

        // Reads diffuse tag
        if(diffuseIndex != -1){
          // Creates variable
          this.lights[id].diffuse = [];

          // Reads r, g, b, a
          var r = this.reader.getFloat(omniChildren[diffuseIndex], 'r');
          var g = this.reader.getFloat(omniChildren[diffuseIndex], 'g');
          var b = this.reader.getFloat(omniChildren[diffuseIndex], 'b');
          var a = this.reader.getFloat(omniChildren[diffuseIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <diffuse> from the <omni> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <diffuse> from the <omni> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <diffuse> from the <omni> node with index " + i + " from the <lights> block";

          // Sets r, g, b, a
          this.lights[id].diffuse.r = r;
          this.lights[id].diffuse.g = g;
          this.lights[id].diffuse.b = b;
          this.lights[id].diffuse.a = a;
        }
        else
        return "tag <diffuse> is not defined on the <omni> node with index " + i + " from the <lights> block";


        // Reads specular tag
        if(specularIndex != -1){
          // Creates variable
          this.lights[id].specular = [];

          // Reads r, g, b, a
          var r = this.reader.getFloat(omniChildren[specularIndex], 'r');
          var g = this.reader.getFloat(omniChildren[specularIndex], 'g');
          var b = this.reader.getFloat(omniChildren[specularIndex], 'b');
          var a = this.reader.getFloat(omniChildren[specularIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <specular> from the <omni> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <specular> from the <omni> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <specular> from the <omni> node with index " + i + " from the <lights> block";

          // Sets r, g, b, a
          this.lights[id].specular.r = r;
          this.lights[id].specular.g = g;
          this.lights[id].specular.b = b;
          this.lights[id].specular.a = a;
        }
        else
        return "tag <specular> is not defined on the <omni> node with index " + i + " from the <lights> block";
      }
      else if(children[i].nodeName == "spot"){
        // Reads spot children and node names
        var spotChildren = children[i].children;
        var spotNodeNames = [];
        for (var j = 0; j < spotChildren.length; j++)
        spotNodeNames.push(spotChildren[j].nodeName);

        // Reads id, enabled, angle, exponent
        var id = this.reader.getString(children[i], 'id');
        var enabled = this.reader.getFloat(children[i], 'enabled');
        var angle = this.reader.getFloat(children[i], 'angle');
        var exponent = this.reader.getFloat(children[i], 'exponent');

        // Validates id, enabled, angle, exponent
        if(id == null || enabled == null || angle == null || exponent == null)
        return "unable to parse id, enabled, angle, exponent components (null) on the <spot> node with index " + i + " from the <lights> block";
        else if(isNaN(enabled) || isNaN(angle) || isNaN(exponent))
        return "unable to parse enabled, angle, exponent components (NaN) on the <spot> node with index " + i + " from the <lights> block";
        else if(enabled != 0 && enabled != 1)
        return "unable to parse enabled component (not valid - should be 0 or 1) on the <spot> node with index " + i + " from the <lights> block";

        // Checks if id is unique
        if(this.lights[id] != null)
        return "id '" + id + "' on the <spot> node with index " + i + " from the <lights> block is not unique";

        // Sets id, enabled, angle, exponent
        this.lights[id] = [];
        this.lights[id].type = "spot";
        this.lights[id].enabled = enabled? true : false;
        this.lights[id].angle = angle;
        this.lights[id].exponent = exponent;

        // Gets indexes of location, target ambient, diffuse, specular
        var locationIndex = spotNodeNames.indexOf("location");
        var targetIndex = spotNodeNames.indexOf("target");
        var ambientIndex = spotNodeNames.indexOf("ambient");
        var diffuseIndex = spotNodeNames.indexOf("diffuse");
        var specularIndex = spotNodeNames.indexOf("specular");

        // Reads location tag
        if(locationIndex != -1){
          // Creates variable
          this.lights[id].location = [];

          // Reads x, y, z, w
          var x = this.reader.getFloat(spotChildren[locationIndex], 'x');
          var y = this.reader.getFloat(spotChildren[locationIndex], 'y');
          var z = this.reader.getFloat(spotChildren[locationIndex], 'z');
          var w = this.reader.getFloat(spotChildren[locationIndex], 'w');

          // Validates x, y, z, w
          if(isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w))
          return "unable to parse x, y, z, w component (NaN) on tag <location> from the <spot> node with index " + i + " from the <lights> block";
          else if(x == null || y == null || z == null || w == null)
          return "unable to parse x, y, z, w component (null) on tag <location> from the <spot> node with index " + i + " from the <lights> block";

          // Sets x, y, z, w
          this.lights[id].location.x = x;
          this.lights[id].location.y = y;
          this.lights[id].location.z = z;
          this.lights[id].location.w = w;
        }
        else
        return "tag <location> is not defined on the <spot> node with index " + i + " from the <lights> block";

        // Reads target tag
        if(targetIndex != -1){
          // Creates variable
          this.lights[id].target = [];

          // Reads x, y, z, w
          var x = this.reader.getFloat(spotChildren[targetIndex], 'x');
          var y = this.reader.getFloat(spotChildren[targetIndex], 'y');
          var z = this.reader.getFloat(spotChildren[targetIndex], 'z');

          // Validates x, y, z
          if(isNaN(x) || isNaN(y) || isNaN(z))
          return "unable to parse x, y, z component (NaN) on tag <target> from the <spot> node with index " + i + " from the <lights> block";
          else if(x == null || y == null || z == null)
          return "unable to parse x, y, z component (null) on tag <target> from the <spot> node with index " + i + " from the <lights> block";

          // Sets x, y, z, w
          this.lights[id].target.x = x;
          this.lights[id].target.y = y;
          this.lights[id].target.z = z;
        }
        else
        return "tag <target> is not defined on the <spot> node with index " + i + " from the <lights> block";

        // Reads ambient tag
        if(ambientIndex != -1){
          // Creates variable
          this.lights[id].ambient = [];

          // Reads r, g, b, a
          var r = this.reader.getFloat(spotChildren[ambientIndex], 'r');
          var g = this.reader.getFloat(spotChildren[ambientIndex], 'g');
          var b = this.reader.getFloat(spotChildren[ambientIndex], 'b');
          var a = this.reader.getFloat(spotChildren[ambientIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <ambient> from the <spot> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <ambient> from the <spot> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <ambient> from the <spot> node with index " + i + " from the <lights> block";

          // Sets r, g, b, a
          this.lights[id].ambient.r = r;
          this.lights[id].ambient.g = g;
          this.lights[id].ambient.b = b;
          this.lights[id].ambient.a = a;
        }
        else
        return "tag <ambient> is not defined on the <spot> node with index " + i + " from the <lights> block";

        // Reads diffuse tag
        if(diffuseIndex != -1){
          // Creates variable
          this.lights[id].diffuse = [];

          // Reads r, g, b, a
          var r = this.reader.getFloat(spotChildren[diffuseIndex], 'r');
          var g = this.reader.getFloat(spotChildren[diffuseIndex], 'g');
          var b = this.reader.getFloat(spotChildren[diffuseIndex], 'b');
          var a = this.reader.getFloat(spotChildren[diffuseIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <diffuse> from the <spot> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <diffuse> from the <spot> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <diffuse> from the <spot> node with index " + i + " from the <lights> block";

          // Sets r, g, b, a
          this.lights[id].diffuse.r = r;
          this.lights[id].diffuse.g = g;
          this.lights[id].diffuse.b = b;
          this.lights[id].diffuse.a = a;
        }
        else
        return "tag <diffuse> is not defined on the <spot> node with index " + i + " from the <lights> block";

        // Reads specular tag
        if(specularIndex != -1){
          // Creates variable
          this.lights[id].specular = [];

          // Reads r, g, b, a
          var r = this.reader.getFloat(spotChildren[specularIndex], 'r');
          var g = this.reader.getFloat(spotChildren[specularIndex], 'g');
          var b = this.reader.getFloat(spotChildren[specularIndex], 'b');
          var a = this.reader.getFloat(spotChildren[specularIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <specular> from the <spot> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <specular> from the <spot> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <specular> from the <spot> node with index " + i + " from the <lights> block";

          // Sets r, g, b, a
          this.lights[id].specular.r = r;
          this.lights[id].specular.g = g;
          this.lights[id].specular.b = b;
          this.lights[id].specular.a = a;
        }
        else
        return "tag <specular> is not defined on the <spot> node with index " + i + " from the <lights> block";
      }
      else
      this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <lights> block");
    }

    this.log("Parsed lights");
  }

  /**
  * Parses the <textures> block.
  * @param {array} texturesNode
  */
  parseTextures(texturesNode) {

    // Reads textures children and node names
    var children = texturesNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Checks if there are textures defined
    if(texturesNode.getElementsByTagName('texture').length == 0)
    return "at least one <texture> must be defined on the <textures> block";

    // Creates variables
    this.textures = [];

    // Reads textures
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "texture"){

        // Reads id and file
        var id = this.reader.getString(children[i], 'id');
        var file = this.reader.getString(children[i], 'file');

        // Validates id and file
        if(id == null || file == null)
        return "unable to parse id and file components (null) on the <texture> node with index " + i + " from the <textures> block";

        // Checks if id is unique
        if(this.textures[id] != null)
        return "id '" + id + "' on the <texture> node with index " + i + " from the <textures> block is not unique";

        // Sets texture
        this.textures[id] = new CGFtexture(this.scene, file);
      }
      else
      this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <textures> block");
    }

    this.log("Parsed textures");
    return null;
  }

  /**
  * Parses the <materials> block.
  * @param {array} materialsNode
  */
  parseMaterials(materialsNode) {

    // Reads materials children and node names
    var children = materialsNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Checks if there are any materials defined
    if(materialsNode.getElementsByTagName('material').length == 0)
    return "at least one <material> must be defined on the <materials> block";

    // Creates variables
    this.materials = [];

    // Reads materials
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "material"){

        //Create variables
        var emission = [];
        var ambient = [];
        var specular = [];
        var diffuse = [];

        // Reads material children and node names
        var materialChildren = children[i].children;
        var materialNodeNames = [];
        for (var j = 0; j < materialChildren.length; j++)
        materialNodeNames.push(materialChildren[j].nodeName);

        // Reads id and shininess
        var id = this.reader.getString(children[i], 'id');
        var shininess = this.reader.getFloat(children[i], 'shininess');

        // Validates id and shininess
        if(id == null || shininess == null)
        return "unable to parse id and shininess components (null) on the <material> node with index " + i + " from the <materials> block";
        else if(isNaN(shininess))
        return "unable to parse shininess component (NaN) on the <material> node with index " + i + " from the <materials> block";

        // Verifies if the id is unique
        if(this.materials[id] != null)
        return "id '" + id + "' on the <material> node with index " + i + " from the <materials> block is not unique";

        // Gets indexes of emission, ambient, diffuse, specular
        var emissionIndex = materialNodeNames.indexOf("emission");
        var ambientIndex = materialNodeNames.indexOf("ambient");
        var diffuseIndex = materialNodeNames.indexOf("diffuse");
        var specularIndex = materialNodeNames.indexOf("specular");

        // Reads emission tag
        if(emissionIndex != -1){
          // Reads r, g, b, a
          var r = this.reader.getFloat(materialChildren[emissionIndex], 'r');
          var g = this.reader.getFloat(materialChildren[emissionIndex], 'g');
          var b = this.reader.getFloat(materialChildren[emissionIndex], 'b');
          var a = this.reader.getFloat(materialChildren[emissionIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <emission> from the <material> node with index " + i + " from the <materials> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <emission> from the <material> node with index " + i + " from the <materials> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <emission> from the <material> node with index " + i + " from the <materials> block";

          // Sets r, g, b, a
          emission.r = r;
          emission.g = g;
          emission.b = b;
          emission.a = a;
        }
        else
        return "tag <emission> is not defined on the <material> node with index " + i + " from the <materials> block";


        // Reads ambient tag
        if(ambientIndex != -1){

          // Reads r, g, b, a
          var r = this.reader.getFloat(materialChildren[ambientIndex], 'r');
          var g = this.reader.getFloat(materialChildren[ambientIndex], 'g');
          var b = this.reader.getFloat(materialChildren[ambientIndex], 'b');
          var a = this.reader.getFloat(materialChildren[ambientIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <ambient> from the <material> node with index " + i + " from the <materials> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <ambient> from the <material> node with index " + i + " from the <materials> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <ambient> from the <material> node with index " + i + " from the <materials> block";

          // Sets r, g, b, a
          ambient.r = r;
          ambient.g = g;
          ambient.b = b;
          ambient.a = a;
        }
        else
        return "tag <ambient> is not defined on the <material> node with index " + i + " from the <materials> block";


        // Reads diffuse tag
        if(diffuseIndex != -1){

          // Reads r, g, b, a
          var r = this.reader.getFloat(materialChildren[diffuseIndex], 'r');
          var g = this.reader.getFloat(materialChildren[diffuseIndex], 'g');
          var b = this.reader.getFloat(materialChildren[diffuseIndex], 'b');
          var a = this.reader.getFloat(materialChildren[diffuseIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <diffuse> from the <material> node with index " + i + " from the <materials> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <diffuse> from the <material> node with index " + i + " from the <materials> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <diffuse> from the <material> node with index " + i + " from the <materials> block";

          // Sets r, g, b, a
          diffuse.r = r;
          diffuse.g = g;
          diffuse.b = b;
          diffuse.a = a;
        }
        else
        return "tag <diffuse> is not defined on the <material> node with index " + i + " from the <materials> block";


        // Reads specular tag
        if(specularIndex != -1){

          // Reads r, g, b, a
          var r = this.reader.getFloat(materialChildren[specularIndex], 'r');
          var g = this.reader.getFloat(materialChildren[specularIndex], 'g');
          var b = this.reader.getFloat(materialChildren[specularIndex], 'b');
          var a = this.reader.getFloat(materialChildren[specularIndex], 'a');

          // Validates r, g, b, a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
          return "unable to parse r, g, b, a component (NaN) on tag <specular> from the <material> node with index " + i + " from the <materials> block";
          else if(r == null || g == null || b == null || a == null)
          return "unable to parse r, g, b, a component (null) on tag <specular> from the <material> node with index " + i + " from the <materials> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
          return "unable to parse r, g, b, a component (out of 0.0-1.0 range) on tag <specular> from the <material> node with index " + i + " from the <materials> block";

          // Sets r, g, b, a
          specular.r = r;
          specular.g = g;
          specular.b = b;
          specular.a = a;
        }
        else
        return "tag <specular> is not defined on the <material> node with index " + i + " from the <materials> block";


        // Creates variables
        var material = new CGFappearance(this.scene);
        material.setShininess(shininess);
        material.setAmbient(ambient.r, ambient.g, ambient.b, ambient.a);
        material.setDiffuse(diffuse.r, diffuse.g, diffuse.b, diffuse.a);
        material.setSpecular(specular.r, specular.g, specular.b, specular.a);
        material.setEmission(emission.r, emission.g, emission.b, emission.a);
        this.materials[id] = material;
      }
      else
      this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <materials> block");
    }

    this.log("Parsed materials");
    return null;
  }

  /**
  * Parses the <transformations> block.
  * @param {array} transformationsNode
  */
  parseTransformations(transformationsNode) {

    // Reads transformations children and node names
    var children = transformationsNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Checks if there are any materials defined
    if(transformationsNode.getElementsByTagName('transformation').length == 0)
    return "at least one <transformation> must be defined on the <transformations> block";

    // Creates variables
    this.transformations = [];

    // Reads transformations
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "transformation"){
        // Reads transformation children and node names
        var transformationChildren = children[i].children;
        var transformationNodeNames = [];
        for (var j = 0; j < transformationChildren.length; j++)
        transformationNodeNames.push(transformationChildren[j].nodeName);

        // Checks if there are any instructions
        if(transformationChildren.length == 0)
        return "at least one instruction tag must be defined (either <translate>, <rotate> or scale) on the <transformation> node with index " + i + " from the <transformations> block";

        // Reads id
        var id = this.reader.getString(children[i], 'id');

        // Validates id
        if(id == null)
        return "unable to parse id component (null) on the <transformation> node with index " + i + " from the <transformations> block";

        // Checks if id is unique
        if(this.transformations[id] != null)
        return "id '" + id + "' on the <transformation> node with index " + i + " from the <transformations> block is not unique";

        // Create variables
        var transformationMatrix = mat4.create();
        mat4.identity(transformationMatrix);

        for (var j = 0; j < transformationChildren.length; j++){
          if(transformationChildren[j].nodeName == "translate"){
            // Reads x, y, z
            var x = this.reader.getFloat(transformationChildren[j], 'x');
            var y = this.reader.getFloat(transformationChildren[j], 'y');
            var z = this.reader.getFloat(transformationChildren[j], 'z');

            // Validates x, y, z
            if(isNaN(x) || isNaN(y) || isNaN(z))
            return "unable to parse x, y, z components (NaN) on tag <translate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
            else if(x == null || y == null || z == null)
            return "unable to parse x, y, z components (null) on tag <translate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";

            // Adds translation
            mat4.translate(transformationMatrix, transformationMatrix, [x,y,z]);
          }
          else if(transformationChildren[j].nodeName == "rotate"){
            // Reads axis, angle
            var axis = this.reader.getString(transformationChildren[j], 'axis');
            var angle = this.reader.getFloat(transformationChildren[j], 'angle');

            // Validates axis and angle
            if(isNaN(angle))
            return "unable to parse angle component (NaN) on tag <rotate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
            else if(angle == null || axis == null)
            return "unable to parse axis and angle components (null) on tag <rotate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
            else if(axis != "x" && axis != "y" && axis != "z")
            return "unable to parse axis component (not valid - should be x, y or z) on tag <rotate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";

            // Adds rotation
            if(axis == 'x')
            mat4.rotateX(transformationMatrix, transformationMatrix, angle*DEGREE_TO_RAD);
            else if(axis == 'y')
            mat4.rotateY(transformationMatrix, transformationMatrix, angle*DEGREE_TO_RAD);
            else if(axis == 'z')
            mat4.rotateZ(transformationMatrix, transformationMatrix, angle*DEGREE_TO_RAD);
          }
          else if(transformationChildren[j].nodeName == "scale"){
            // Reads x, y, z
            var x = this.reader.getFloat(transformationChildren[j], 'x');
            var y = this.reader.getFloat(transformationChildren[j], 'y');
            var z = this.reader.getFloat(transformationChildren[j], 'z');

            // Validates x, y, z
            if(isNaN(x) || isNaN(y) || isNaN(z))
            return "unable to parse x, y, z components (NaN) on tag <scale> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
            else if(x == null || y == null || z == null)
            return "unable to parse x, y, z components (null) on tag <scale> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";

            // Adds scaling
            mat4.scale(transformationMatrix, transformationMatrix, [x,y,z]);
          }
          else
          this.onXMLMinorError("tag <" + transformationChildren[j].nodeName + "> with index " + j + " from the <transformation> node with index " + i + " is not valid on the <transformations> block");
        }

        // Sets transformation
        this.transformations[id] = transformationMatrix;
      }
      else
      this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <transformations> block");
    }

    this.log("Parsed transformations");
    return null;
  }

  /**
  * Parses the <animations> block.
  * @param {array} animationsNode
  */
  parseAnimations(animationsNode) {

    // Reads animations children and node names
    var children = animationsNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Creates variables
    this.animations = [];

    // Reads animations
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "texture"){

        // Reads id and file
        var id = this.reader.getString(children[i], 'id');
        var file = this.reader.getString(children[i], 'file');

        // Validates id and file
        if(id == null || file == null)
        return "unable to parse id and file components (null) on the <texture> node with index " + i + " from the <textures> block";

        // Checks if id is unique
        if(this.textures[id] != null)
        return "id '" + id + "' on the <texture> node with index " + i + " from the <textures> block is not unique";

        // Sets texture
        this.textures[id] = new CGFtexture(this.scene, file);
      }
      else
      this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <textures> block");
    }

    this.log("Parsed textures");
    return null;
  }

  /**
  * Parses the <primitives> block.
  * @param {array} primitivesNode
  */
  parsePrimitives(primitivesNode) {

    // Reads primitives children and node names
    var children = primitivesNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Checks if there are any primitives defined
    if(primitivesNode.getElementsByTagName('primitive').length == 0)
    return "at least one <primitive> must be defined on the <primitives> block";

    // Creates variables
    this.primitives = [];

    // Reads primitives
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "primitive"){

        // Reads primitive children and node names
        var primitiveChildren = children[i].children;
        var primitiveNodeNames = [];
        for (var j = 0; j < primitiveChildren.length; j++)
        primitiveNodeNames.push(primitiveChildren[j].nodeName);

        // Checks if there's at most one of rectangle, triangle, cylinder, sphere or torus
        if(children[i].children.length > 1)
        return "only one primitive tag should be defined on the <primitive> node with index " + i + " from the <primitives> block";
        else if(children[i].children.length == 0)
        return "one primitive tag must be defined on the <primitive> node with index " + i + " from the <primitives> block";

        // Creates variables
        var tagIndex = 0;

        // Reads id
        var id = this.reader.getString(children[i], 'id');

        // Validates id
        if(id == null)
        return "unable to parse id component (null) on the <primitive> node with index " + i + " from the <primitives> block";

        // Verifies if the id is unique
        if(this.primitives[id] != null)
        return "id '" + id + "' on the <primitive> node with index " + i + " from the <primitives> block is not unique";

        // Reads primitive tag
        if(children[i].children[tagIndex].nodeName == "rectangle"){

          // Reads x1, x2, y1, y2
          var x1 = this.reader.getFloat(children[i].children[tagIndex], 'x1');
          var x2 = this.reader.getFloat(children[i].children[tagIndex], 'x2');
          var y1 = this.reader.getFloat(children[i].children[tagIndex], 'y1');
          var y2 = this.reader.getFloat(children[i].children[tagIndex], 'y2');

          // Validates x1, x2, y1, y2
          if(isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2))
          return "unable to parse x1, x2, y1, y2 components (NaN) on tag <rectangle> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(x1 == null || x2 == null || y1 == null || y2 == null)
          return "unable to parse x1, x2, y1, y2 components (null) on tag <rectangle> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets rectangle
          this.primitives[id] = new MyRectangle(this.scene, x1, x2, y1, y2);
        }
        else if(children[i].children[tagIndex].nodeName == "triangle"){

          // Reads x1, x2, x3, y1, y2, y3, z1, z2, z3
          var x1 = this.reader.getFloat(children[i].children[tagIndex], 'x1');
          var x2 = this.reader.getFloat(children[i].children[tagIndex], 'x2');
          var x3 = this.reader.getFloat(children[i].children[tagIndex], 'x3');
          var y1 = this.reader.getFloat(children[i].children[tagIndex], 'y1');
          var y2 = this.reader.getFloat(children[i].children[tagIndex], 'y2');
          var y3 = this.reader.getFloat(children[i].children[tagIndex], 'y3');
          var z1 = this.reader.getFloat(children[i].children[tagIndex], 'z1');
          var z2 = this.reader.getFloat(children[i].children[tagIndex], 'z2');
          var z3 = this.reader.getFloat(children[i].children[tagIndex], 'z3');

          // Validates x1, x2, x3, y1, y2, y3, z1, z2, z3
          if(isNaN(x1) || isNaN(x2) || isNaN(x3) || isNaN(y1) || isNaN(y2) || isNaN(y3) || isNaN(z1) || isNaN(z2) || isNaN(z3))
          return "unable to parse x1, x2, x3, y1, y2, y3, z1, z2, z3 components (NaN) on tag <triangle> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(x1 == null || x2 == null ||  x3 == null || y1 == null || y2 == null || y3 == null ||  z1 == null || z2 == null || z3 == null)
          return "unable to parse x1, x2, x3, y1, y2, y3, z1, z2, z3 components (null) on tag <triangle> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets triangle
          this.primitives[id] = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);
        }
        else if(children[i].children[tagIndex].nodeName == "cylinder"){

          // Reads base, top, height, slices, stacks
          var base = this.reader.getFloat(children[i].children[tagIndex], 'base');
          var top = this.reader.getFloat(children[i].children[tagIndex], 'top');
          var height = this.reader.getFloat(children[i].children[tagIndex], 'height');
          var slices = this.reader.getInteger(children[i].children[tagIndex], 'slices');
          var stacks = this.reader.getInteger(children[i].children[tagIndex], 'stacks');

          // Validates base, top, height, slices, stacks
          if(isNaN(base) || isNaN(top) || isNaN(height) || isNaN(slices) || isNaN(stacks))
            return "unable to parse base, top, height, slices, stacks components (NaN) on tag <cylinder> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(base == null || top == null || height == null || slices == null || stacks == null)
            return "unable to parse base, top, height, slices, stacks components (null) on tag <cylinder> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(slices < 1 || stacks < 1)
            return "unable to parse slices and stacks components (out of 1-inf range) on tag <cylinder> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(height < 0)
            return "unable to parse height component (out of 0-inf range) on tag <cylinder> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets cylinder
          this.primitives[id] = new MyCylinder(this.scene, base, top, height, slices, stacks);
        }
        else if(children[i].children[tagIndex].nodeName == "sphere"){

          // Reads radius, slices, stacks
          var radius = this.reader.getFloat(children[i].children[tagIndex], 'radius');
          var slices = this.reader.getInteger(children[i].children[tagIndex], 'slices');
          var stacks = this.reader.getInteger(children[i].children[tagIndex], 'stacks');

          // Validates radius, slices, stacks
          if(isNaN(radius) || isNaN(slices) || isNaN(stacks))
            return "unable to parse radius, slices, stacks components (NaN) on tag <sphere> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(radius == null || slices == null || stacks == null)
            return "unable to parse radius, slices, stacks components (null) on tag <sphere> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(slices < 1 || stacks < 1)
            return "unable to parse slices and stacks components (out of 1-inf range) on tag <sphere> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(radius <= 0)
            return "unable to parse radius component (out of 0-inf range) on tag <sphere> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets sphere
          this.primitives[id] = new MySphere(this.scene, radius, slices, stacks);
        }
        else if(children[i].children[tagIndex].nodeName == "torus"){

          // Reads inner, outer, slices, loops
          var inner = this.reader.getFloat(children[i].children[tagIndex], 'inner');
          var outer = this.reader.getFloat(children[i].children[tagIndex], 'outer');
          var slices = this.reader.getInteger(children[i].children[tagIndex], 'slices');
          var loops = this.reader.getInteger(children[i].children[tagIndex], 'loops');

          // Validates inner, outer, slices, loops
          if(isNaN(inner) || isNaN(outer) || isNaN(slices) || isNaN(loops))
            return "unable to parse inner, outer, slices, loops components (NaN) on tag <torus> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(inner == null || outer == null || slices == null || loops == null)
            return "unable to parse inner, outer, slices, loops components (null) on tag <torus> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(slices < 1 || stacks < 1)
            return "unable to parse slices and stacks components (out of 1-inf range) on tag <torus> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(inner < 0 || outer <= 0)
            return "unable to parse inner and outer components (out of 0-inf range) on tag <torus> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets torus
          this.primitives[id] = new MyTorus(this.scene, inner, outer, slices, loops);
        }
        else if(children[i].children[tagIndex].nodeName == "plane"){

          // Reads npartsU, npartsV
          var npartsU = this.reader.getInteger(children[i].children[tagIndex], 'npartsU');
          var npartsV = this.reader.getInteger(children[i].children[tagIndex], 'npartsV');

          // Validates npartsU, npartsV
          if(isNaN(npartsU) || isNaN(npartsV))
            return "unable to parse npartsU, npartsV components (NaN) on tag <plane> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(npartsU == null || npartsV == null)
            return "unable to parse npartsU, npartsV components (null) on tag <plane> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(npartsU <= 0 || npartsV <= 0)
            return "unable to parse npartsU, npartsV components (out of 0-inf range) on tag <plane> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets plane
          this.primitives[id] = new MyPlane(this.scene, npartsU, npartsV);
        }
        else if(children[i].children[tagIndex].nodeName == "patch"){

          // Reads npartsU, npartsV, npointsU, npointsV
          var npartsU = this.reader.getInteger(children[i].children[tagIndex], 'npartsU');
          var npartsV = this.reader.getInteger(children[i].children[tagIndex], 'npartsV');
          var npointsU = this.reader.getInteger(children[i].children[tagIndex], 'npointsU');
          var npointsV = this.reader.getInteger(children[i].children[tagIndex], 'npointsV');

          // Validates npartsU, npartsV, npointsU, npointsV
          if(isNaN(npartsU) || isNaN(npartsV) || isNaN(npointsU) || isNaN(npointsV))
            return "unable to parse npartsU, npartsV, npointsU, npointsV components (NaN) on tag <patch> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(npartsU == null || npartsV == null || npointsU == null || npointsV == null)
            return "unable to parse npartsU, npartsV, npointsU, npointsV components (null) on tag <patch> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(npartsU <= 0 || npartsV <= 0 || npointsU <= 0 || npointsV <= 0)
            return "unable to parse npartsU, npartsV, npointsU, npointsV components (out of 0-inf range) on tag <patch> from the <primitive> node with index " + i + " from the <primitives> block";

          // Reads control points
          var controlpoints = [];
          var patchChildren = children[i].children[tagIndex].children;
          for (var j = 0; j < patchChildren.length; j++){
              // Reads xx, yy, zz
              var xx = this.reader.getFloat(patchChildren[j], 'xx');
              var yy = this.reader.getFloat(patchChildren[j], 'yy');
              var zz = this.reader.getFloat(patchChildren[j], 'zz');

              // Validates xx, yy, zz
              if(isNaN(xx) || isNaN(yy) || isNaN(zz))
                return "unable to parse xx, yy, zz components (NaN) on tag <controlpoint> with index " + j + " from tag <patch> from the <primitive> node with index " + i + " from the <primitives> block";
              else if(xx == null || yy == null || zz == null)
                return "unable to parse xx, yy, zz components (null) on tag <controlpoint> with index " + j + " from tag <patch> from the <primitive> node with index " + i + " from the <primitives> block";
              else if(xx <= 0 || yy <= 0 || zz <= 0)
                return "unable to parse xx, yy, zz components (out of 0-inf range) on tag <controlpoint> with index " + j + " from tag <patch> from the <primitive> node with index " + i + " from the <primitives> block";

              controlpoints.push([xx,yy,zz]);
          }

          // Check if controlpoints length is npointsU*npointsV
          if(controlpoints.length != npointsU*npointsV)
            return "invalid number of control points on tag <patch> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets patch
          this.primitives[id] = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlpoints);
        }
        else if(children[i].children[tagIndex].nodeName == "vehicle"){
          // Sets vehicle
          this.primitives[id] = new MyVehicle(this.scene);
        }
        else if(children[i].children[tagIndex].nodeName == "cylinder2"){
          // Reads base, top, height, slices, stacks
          var base = this.reader.getFloat(children[i].children[tagIndex], 'base');
          var top = this.reader.getFloat(children[i].children[tagIndex], 'top');
          var height = this.reader.getFloat(children[i].children[tagIndex], 'height');
          var slices = this.reader.getInteger(children[i].children[tagIndex], 'slices');
          var stacks = this.reader.getInteger(children[i].children[tagIndex], 'stacks');

          // Validates base, top, height, slices, stacks
          if(isNaN(base) || isNaN(top) || isNaN(height) || isNaN(slices) || isNaN(stacks))
            return "unable to parse base, top, height, slices, stacks components (NaN) on tag <cylinder2> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(base == null || top == null || height == null || slices == null || stacks == null)
            return "unable to parse base, top, height, slices, stacks components (null) on tag <cylinder2> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(slices < 1 || stacks < 1)
            return "unable to parse slices and stacks components (out of 1-inf range) on tag <cylinder2> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(height < 0)
            return "unable to parse height component (out of 0-inf range) on tag <cylinder2> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets cylinder
          this.primitives[id] = new MyCylinder2(this.scene, base, top, height, slices, stacks);
        }
        else if(children[i].children[tagIndex].nodeName == "terrain"){
          // Reads idtexture, idheightmap, parts, heightscale
          var idtexture = this.reader.getString(children[i].children[tagIndex], 'idtexture');
          var idheightmap = this.reader.getString(children[i].children[tagIndex], 'idheightmap');
          var parts = this.reader.getInteger(children[i].children[tagIndex], 'parts');
          var heightscale = this.reader.getFloat(children[i].children[tagIndex], 'heightscale');

          // Validates idtexture, idheightmap, parts, heightscale
          if(isNaN(parts) || isNaN(heightscale))
            return "unable to parse parts, heightscale components (NaN) on tag <terrain> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(idtexture == null || idheightmap == null || parts == null || heightscale == null)
            return "unable to parse idtexture, idheightmap, parts, heightscale components (null) on tag <terrain> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(parts <= 0 || heightscale <= 0)
            return "unable to parse parts, heightscale components (out of 1-inf range) on tag <terrain> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(this.textures[idtexture] == null || this.textures[idheightmap] == null)
            return "invalid texture id on tag <terrain> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets terrain
          this.primitives[id] = new MyTerrain(this.scene, idtexture, idheightmap, parts, heightscale);
        }
        else if(children[i].children[tagIndex].nodeName == "water"){
          // Reads idtexture, idwavemap, parts, heightscale, texscale
          var idtexture = this.reader.getString(children[i].children[tagIndex], 'idtexture');
          var idwavemap = this.reader.getString(children[i].children[tagIndex], 'idwavemap');
          var parts = this.reader.getInteger(children[i].children[tagIndex], 'parts');
          var heightscale = this.reader.getFloat(children[i].children[tagIndex], 'heightscale');
          var texscale = this.reader.getFloat(children[i].children[tagIndex], 'texscale');

          // Validates idtexture, idwavemap, parts, heightscale, texscale
          if(isNaN(parts) || isNaN(heightscale) || isNaN(texscale))
            return "unable to parse parts, heightscale, texscale components (NaN) on tag <water> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(idtexture == null || idwavemap == null || parts == null || heightscale == null || texscale == null)
            return "unable to parse idtexture, idwavemap, parts, heightscale, texscale components (null) on tag <water> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(parts <= 0 || heightscale <= 0 || texscale <= 0)
            return "unable to parse parts, heightscale, texscale components (out of 1-inf range) on tag <water> from the <primitive> node with index " + i + " from the <primitives> block";
          else if(this.textures[idtexture] == null || this.textures[idwavemap] == null)
            return "invalid texture id on tag <water> from the <primitive> node with index " + i + " from the <primitives> block";

          // Sets terrain
          this.primitives[id] = new MyWater(this.scene, idtexture, idwavemap, parts, heightscale, texscale);
        }
        else
        this.onXMLMinorError("tag <" + children[i].children[tagIndex].nodeName + "> is not valid on the <primitive> node with index " + i + " from the <primitives> block");
      }
      else
      this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <primitives> block");
    }

    this.log("Parsed primitives");
    return null;
  }

  /**
  * Parses the <components> block.
  * @param {array} componentsNode
  */
  parseComponents(componentsNode) {

    // Reads componenets children and node names
    var children = componentsNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Checks if there are any components defined
    if(componentsNode.getElementsByTagName('component').length == 0)
      return "at least one <component> must be defined on the <components> block";

    // Creates variables
    this.components = [];

    // Reads components
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "component"){
        // Reads component children and node names
        var componentChildren = children[i].children;
        var componentNodeNames = [];
        for (var j = 0; j < componentChildren.length; j++)
        componentNodeNames.push(componentChildren[j].nodeName);

        // Reads id
        var id = this.reader.getString(children[i], 'id');

        // Validates id
        if(id == null)
        return "unable to parse id component (null) on the <component> node with index " + i + " from the <components> block";

        // Verifies if the id is unique
        if(this.components[id] != null)
          return "id '" + id + "' on the <component> node with index " + i + " from the <components> block is not unique";

        // Creates variables
        this.components[id] = new MyGraphNode(this, id);

        // Gets indexes of transformation, materials, texture and children
        var transformationIndex = componentNodeNames.indexOf("transformation");
        var materialsIndex = componentNodeNames.indexOf("materials");
        var textureIndex = componentNodeNames.indexOf("texture");
        var childrenIndex = componentNodeNames.indexOf("children");

        // Reads transformation tag
        if(transformationIndex != -1){

          // Checks if there aren't explicit and referenced transformations defined at the same time
          if(componentChildren[transformationIndex].getElementsByTagName("transformationref").length > 0 && (componentChildren[transformationIndex].getElementsByTagName("rotate").length > 0 || componentChildren[transformationIndex].getElementsByTagName("translate").length > 0 ||componentChildren[transformationIndex].getElementsByTagName("scale").length > 0))
          return "there can't be explicit and referenced transformations defined at the same time on tag <transformation> on the <component> node with index " + i + " from the <components> block";

          if(componentChildren[transformationIndex].children.length != 0){
            // Reads transformation children and node names
            var transformationChildren = componentChildren[transformationIndex].children;
            var transformationNodeNames = [];
            for (var j = 0; j < transformationChildren.length; j++)
            transformationNodeNames.push(transformationChildren[j].nodeName);

            // Create variables
            var transformationMatrix = mat4.create();
            mat4.identity(transformationMatrix);
            var transformationRef = false;

            // Reads transformation
            for(var j = 0; j < transformationChildren.length; j++){
              if(transformationNodeNames[j] == "transformationref"){
                // Reads id
                var transformationID = this.reader.getString(componentChildren[transformationIndex].children[j], 'id');

                // Validates id
                if(transformationID == null)
                return "unable to parse id component (null) on tag <transformationref> on tag <transformations> on the <component> node with index " + i + " from the <components> block";

                // Checks if id exists
                if(this.transformations[transformationID] != null)
                  this.components[id].transformation = this.transformations[transformationID];
                else
                  return "id '" + transformationID + "' is not a valid transformation reference on tag <transformation> on the <component> node with index " + i + " from the <components> block";

                transformationRef = true;
              }
              else if(transformationNodeNames[j] == "translate"){
                // Reads x, y, z
                var x = this.reader.getFloat(transformationChildren[j], 'x');
                var y = this.reader.getFloat(transformationChildren[j], 'y');
                var z = this.reader.getFloat(transformationChildren[j], 'z');

                // Validates x, y, z
                if(isNaN(x) || isNaN(y) || isNaN(z))
                return "unable to parse x, y, z components (NaN) on tag <translate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";
                else if(x == null || y == null || z == null)
                return "unable to parse x, y, z components (null) on tag <translate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                // Adds translation
                mat4.translate(transformationMatrix, transformationMatrix, [x,y,z]);
              }
              else if(transformationNodeNames[j] == "rotate"){
                // Reads axis, angle
                var axis = this.reader.getString(transformationChildren[j], 'axis');
                var angle = this.reader.getFloat(transformationChildren[j], 'angle');

                // Validates axis and angle
                if(isNaN(angle))
                return "unable to parse angle component (NaN) on tag <rotate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";
                else if(angle == null || axis == null)
                return "unable to parse axis and angle components (null) on tag <rotate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";
                else if(axis != "x" && axis != "y" && axis != "z")
                return "unable to parse axis component (not valid - should be x, y or z) on tag <rotate> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                // Adds rotation
                if(axis == 'x')
                mat4.rotateX(transformationMatrix, transformationMatrix, angle*DEGREE_TO_RAD);
                else if(axis == 'y')
                mat4.rotateY(transformationMatrix, transformationMatrix, angle*DEGREE_TO_RAD);
                else if(axis == 'z')
                mat4.rotateZ(transformationMatrix, transformationMatrix, angle*DEGREE_TO_RAD);
              }
              else if(transformationNodeNames[j] == "scale"){
                // Reads x, y, z
                var x = this.reader.getFloat(transformationChildren[j], 'x');
                var y = this.reader.getFloat(transformationChildren[j], 'y');
                var z = this.reader.getFloat(transformationChildren[j], 'z');

                // Validates x, y, z
                if(isNaN(x) || isNaN(y) || isNaN(z))
                return "unable to parse x, y, z components (NaN) on tag <scale> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";
                else if(x == null || y == null || z == null)
                return "unable to parse x, y, z components (null) on tag <scale> with index " + j + " on tag <transformation> with index " + transformationIndex + " from the <component> node with index " + i + " from the <components> block";

                // Adds scaling
                mat4.scale(transformationMatrix, transformationMatrix, [x,y,z]);
              }
              else
              this.onXMLMinorError("tag <" + transformationChildren[j].nodeName + "> with index " + j + " on tag <transformation> on the <component> node with index " + i + " is not valid on the <components> block");
            }

            // Sets transformation
            if(!transformationRef)
              this.components[id].transformation = transformationMatrix;
          }
        }
        else
        return "tag <transformation> is not defined on the <component> node with index " + i + " from the <components> block";

        // Reads materials tag
        if(materialsIndex != -1){

          // Checks if there are any materials defined
          if(componentChildren[materialsIndex].children.length == 0)
          return "at least one <material> must be defined on tag <materials> on the <component> node with index " + i + " from the <components> block";

          // Reads materials children and node names
          var materialsChildren = componentChildren[materialsIndex].children;
          var materialsNodeNames = [];
          for (var j = 0; j < materialsChildren.length; j++)
          materialsNodeNames.push(materialsChildren[j].nodeName);

          for(var j = 0; j < materialsChildren.length; j++){
            if(materialsNodeNames[j] == "material"){
              // Reads id
              var materialID = this.reader.getString(componentChildren[materialsIndex].children[j], 'id');

              // Validates id
              if(materialID == null)
              return "unable to parse id component (null) on tag <material> with index " + j + " on tag <materials> on the <component> node with index " + i + " from the <components> block";

              // Checks if id exists
              if(materialID == "inherit")
                this.components[id].materials[materialID] = materialID
              else
                if(this.materials[materialID] != null)
                  this.components[id].materials[materialID] = this.materials[materialID];
                else
                  return "id '" + materialID + "' is not a valid transformation reference on tag <material> with index " + j + " on tag <materials> on the <component> node with index " + i + " from the <components> block";
            }
            else
            this.onXMLMinorError("tag <" + materialsNodeNames[j] + "> is not valid on tag <material> with index " + j + " on tag <materials> on the <component> node with index " + i + " from the <components> block");
          }
        }
        else
        return "tag <materials> is not defined on the <component> node with index " + i + " from the <components> block";

        // Reads texture tag
        if(textureIndex != -1){

          // Reads id, length_s, length_t
          var textureID = this.reader.getString(componentChildren[textureIndex], 'id');
          var length_s = this.reader.getFloat(componentChildren[textureIndex], 'length_s', false);
          var length_t = this.reader.getFloat(componentChildren[textureIndex], 'length_t', false);

          // Validates id, length_s, length_t
          if(textureID == null)
            return "unable to parse id component (null) on tag <texture> on the <component> node with index " + i + " from the <components> block";
          if((length_s == null || length_t == null) && textureID != "none" && textureID != "inherit")
            return "unable to parse length_s, length_t components (null) on tag <texture> on the <component> node with index " + i + " from the <components> block";
          if(length_s != null && length_t != null)
            if(isNaN(length_s) || isNaN(length_t))
              return "unable to length_s, length_t components (NaN) on tag <texture> on the <component> node with index " + i + " from the <components> block";
            else if(length_s <= 0 || length_t <= 0)
              return "unable to length_s, length_t components (out of 0-inf. range) on tag <texture> on the <component> node with index " + i + " from the <components> block";

          // Checks if id exists
          if(textureID == "inherit" || textureID == "none")
            this.components[id].texture = textureID;
          else
            if(this.textures[textureID] != null)
              this.components[id].texture = this.textures[textureID];
            else
              return "id '" + textureID + "' is not a valid transformation reference on tag <texture> on the <component> node with index " + i + " from the <components> block";

          // Sets length_s, length_t
          this.components[id].length_s = length_s;
          this.components[id].length_t = length_t;
        }
        else
        return "tag <texture> is not defined on the <component> node with index " + i + " from the <components> block";


        // Reads children tag
        if(childrenIndex != -1){

          // Checks if there are any children defined
          if(componentChildren[childrenIndex].getElementsByTagName("componentref").length == 0 && componentChildren[childrenIndex].getElementsByTagName("primitiveref").length == 0)
            return "at least one children (either <componentref> or  <primitiveref>) should be defined on tag <children> on the <component> node with index " + i + " from the <components> block";

          // Reads children children and node names
          var childrenChildren = componentChildren[childrenIndex].children;
          var childrenNodeNames = [];
          for (var j = 0; j < childrenChildren.length; j++)
          childrenNodeNames.push(childrenChildren[j].nodeName);

          for(var j = 0; j < childrenChildren.length; j++){
            if(childrenChildren[j].nodeName == "componentref"){
              // Reads id
              var componentID = this.reader.getString(childrenChildren[j], 'id');

              // Validates id
              if(componentID == null)
              return "unable to parse id component (null) on tag <componentref> with index " + j +" on tag <children> on the <component> node with index " + i + " from the <components> block";

              this.components[id].addChild(componentID);
            }
            else if(childrenChildren[j].nodeName == "primitiveref"){
              // Reads id
              var primitiveID = this.reader.getString(childrenChildren[j], 'id');

              // Validates id
              if(primitiveID == null)
              return "unable to parse id component (null) on tag <primitiveref> with index " + j +" on tag <children> on the <component> node with index " + i + " from the <components> block";


              // Checks if id exists
              if(this.primitives[primitiveID] != null)
                this.components[id].addPrimitive(this.primitives[primitiveID]);
              else
                return "id '" + primitiveID + "' is not a valid primitive reference on tag <primitiveref> with index " + j +" on tag <children> on the <component> node with index " + i + " from the <components> block";
            }
            else
            this.onXMLMinorError("tag <" + childrenChildren[j].nodeName + "> with index " + j + " is not valid on tag <children> on the <component> node with index " + i + " from the <components> block");
          }
        }
        else
        return "tag <children> is not defined on the <component> node with index " + i + " from the <components> block";
      }
      else
      this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <components> block");
    }

    if(this.components[this.root] == null)
      return "root <component> with id '" + this.root + "' must be defined on the <components> block";

    for(var key1 in this.components)
        for(var key2 in this.components[key1].children)
          if(this.components[this.components[key1].children[key2]] == null)
            return "id '" + this.components[key1].children[key2] + "' is not a valid component reference on tag <componentref> on tag <children> on the <component> node with id '" + key1 + "' from the <components> block";


    this.log("Parsed components");
    return null;
  }

  /**
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
  * Displays the scene, starting in the root node.
  */
  displayScene() {
    this.displayNode(this.components[this.root], this.components[this.root].materials[0], this.components[this.root].texture);
  }

  /**
  * Displays the scene recursively , processing one node at a time
  * @param {MyGraphNode} node             represents the current node being displayed
  * @param {CGFappearance} parentMaterial represents the current node's parent's material
  * @param {string} parentTexture         represents the current node's parent's texture
  * @param {number} parentS               represents the current node's parent's length_s
  * @param {number} parentT               represents the current node's parent's length_t
  */
  displayNode(node, parentMaterial, parentTexture, parentS, parentT){
    this.scene.pushMatrix();

      // Applies the node transformation
      this.scene.multMatrix(node.transformation);

      var currentMaterial;
      var currentTexture;
      var currentS;
      var currentT;
      var allMaterials = [];
      var materialIndex = this.scene.currentMaterial;
      var i = 0;

      // Stores all node's materials in order
      for(var key in node.materials){
        allMaterials[i] = node.materials[key];
        i++;
      }

      // Checks if it's going to use node or parent material
      if(allMaterials[materialIndex % i] == "inherit")
        currentMaterial = parentMaterial;
      else
        currentMaterial = allMaterials[materialIndex % i];

      // Checks if it's going to use node or parent texture or even none
      if(node.texture == "inherit")
        currentTexture = parentTexture
      else if(node.texture == "none")
        currentTexture = "none";
      else
        currentTexture = node.texture;

      // Checks if it's going to use node or parent texture lengths
      if(node.texture == "inherit" && node.length_s == null && node.length_t == null){
        currentS = parentS;
        currentT = parentT
      }
      else if(node.texture == "inherit" && node.length_s == null){
        currentS = parentS;
        currentT = node.length_t;
      }
      else if(node.texture == "inherit" && node.length_t == null){
        currentS = node.length_s;
        currentT = parentT;
      }
      else if(node.texture != "none"){
        currentS = node.length_s;
        currentT = node.length_t;
      }

      if(currentTexture != "none")
        currentMaterial.setTexture(currentTexture);
      else
        currentMaterial.setTexture(null);

      currentMaterial.apply();

      // Displays node's primitives and updates their texCoords
      for(var key in node.primitives){
        if(currentTexture != "none")
          node.primitives[key].updateTexCoords(currentS, currentT);
        node.primitives[key].display();
      }

      // Recursively calls displayNode for all node's children
      for(var i = 0; i < node.children.length; i++)
        this.displayNode(this.components[node.children[i]], currentMaterial, currentTexture, currentS, currentT);

    this.scene.popMatrix();
  }
}
