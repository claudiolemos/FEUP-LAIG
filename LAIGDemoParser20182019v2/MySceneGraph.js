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
  */
  parseViews(viewsNode) {

    // Reads views children and node names
    var children = viewsNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Initializes views
    this.views = [];

    // Reads default view (perspective or ortho)
    var defaultView = this.reader.getString(viewsNode, "default");

    // Validates default
    if(defaultView != 'perspective' && defaultView != 'ortho')
      return "unable to parse default component on the <views> block; must be 'perspective' or 'ortho'";

    // Sets default value
    this.views.default = defaultView;

    // Gets index of each view
    var perspectiveIndex = nodeNames.indexOf('perspective');
    var orthoIndex = nodeNames.indexOf('ortho');


    // Checks if there's at least one of the views (perspective or ortho)
    if (children.length == 0 || (perspectiveIndex == -1 && orthoIndex == -1))
      return "at least one view must be defined (either <perspective> or <ortho>) on the <views> block";

    // Checks if there's only one of each view defined
    if(children.length > 2 || (viewsNode.getElementsByTagName('perspective').length != 1 &&  viewsNode.getElementsByTagName('ortho').length != 1))
      return "only one of each view should be defined (<perspective> and/or <ortho>)";

    // Creates variables
    this.perspective = [];
    this.ortho = []

    // Reads perspective node
    if(perspectiveIndex != -1){
      // Reads perspective node children and node names
      var perspectiveChildren = children[perspectiveIndex].children;
      var perspectiveNodeNames = [];
      for (var i = 0; i < perspectiveChildren.length; i++)
      perspectiveNodeNames.push(perspectiveChildren[i].nodeName);

      // Reads id, near far and angle
      var id = this.reader.getString(children[perspectiveIndex], 'id');
      var near = this.reader.getFloat(children[perspectiveIndex], 'near');
      var far = this.reader.getFloat(children[perspectiveIndex], 'far');
      var angle = this.reader.getFloat(children[perspectiveIndex], 'angle');

      // Validates id, near, far and angle
      if(id == null || near == null || far == null || angle == null)
        return "unable to parse id, near, far and angle components (null) on the <perspective> node from the <views> block";
      else if(isNaN(near) || isNaN(far) || isNaN(angle))
        return "unable to parse near, far and angle components (NaN) on the <perspective> node from the <views> block";

      // Sets id, near, far and angle
      this.perspective.id = id;
      this.perspective.near = near;
      this.perspective.far = far;
      this.perspective.angle = angle;

      // Creates from and to variables
      this.perspective.from = [];
      this.perspective.to = []

      // Gets indexes of each element (from & too)
      var fromIndex = perspectiveNodeNames.indexOf('from');
      var toIndex = perspectiveNodeNames.indexOf('to');

      // Reads from and to nodes
      if(fromIndex != -1){
        // Reads x, y and z values
        var x = this.reader.getFloat(perspectiveChildren[fromIndex], 'x');
        var y = this.reader.getFloat(perspectiveChildren[fromIndex], 'y');
        var z = this.reader.getFloat(perspectiveChildren[fromIndex], 'z');

        // Validates x, y and z values
        if(x == null || y == null || z == null)
          return "unable to parse x, y and z components (null) on tag <from> from the <perspective> node from the <views> block"
        else if(isNaN(x) || isNaN(y) || isNaN(z))
          return "unable to parse x, y and z components (NaN) on tag <from> from the <perspective> node from the <views> block"

        // Sets x, y and z values
        this.perspective.from.x = x;
        this.perspective.from.y = y;
        this.perspective.from.z = z;
      }
      else
        return "tag <from> is not defined on the <perspective> node from the <views> block"

        if(toIndex != -1){
          // Reads x, y and z values
          var x = this.reader.getFloat(perspectiveChildren[toIndex], 'x');
          var y = this.reader.getFloat(perspectiveChildren[toIndex], 'y');
          var z = this.reader.getFloat(perspectiveChildren[toIndex], 'z');

          // Validates x, y and z values
          if(x == null || y == null || z == null)
            return "unable to parse x, y and z components (null) on tag <to> from the <perspective> node from the <views> block"
          else if(isNaN(x) || isNaN(y) || isNaN(z))
            return "unable to parse x, y and z components (NaN) on tag <to> from the <perspective> node from the <views> block"

          // Sets x, y and z values
          this.perspective.to.x = x;
          this.perspective.to.y = y;
          this.perspective.to.z = z;
        }
        else
          return "tag <to> is not defined on the <perspective> node from the <views> block"
    }

    //Reads ortho node
    if(orthoIndex != -1){
      // Reads ortho node children and node names
      var orthoChildren = children[orthoIndex].children;
      var orthoNodeNames = [];
      for (var i = 0; i < orthoChildren.length; i++)
        orthoNodeNames.push(orthoChildren[i].nodeName);

      // Reads id, near far, left, right, top and bottom
      var id = this.reader.getString(children[orthoIndex], 'id');
      var near = this.reader.getFloat(children[orthoIndex], 'near');
      var far = this.reader.getFloat(children[orthoIndex], 'far');
      var left = this.reader.getFloat(children[orthoIndex], 'left');
      var right = this.reader.getFloat(children[orthoIndex], 'right');
      var top = this.reader.getFloat(children[orthoIndex], 'top');
      var bottom = this.reader.getFloat(children[orthoIndex], 'bottom');

      // Validates id, near far, left, right, top and bottom
      if(id == null || near == null || far == null || left == null || right == null || top == null || bottom == null)
        return "unable to parse id, near far, left, right, top and bottom components (null) on the <ortho> node from the <views> block";
      else if(isNaN(near) || isNaN(far) || isNaN(left) || isNaN(right) || isNaN(top) || isNaN(bottom))
        return "unable to parse near far, left, right, top and bottom components (NaN) on the <ortho> node from the <views> block";

      // Sets id, near far, left, right, top and bottom
      this.ortho.id = id;
      this.ortho.near = near;
      this.ortho.far = far;
      this.ortho.left = left;
      this.ortho.right = right;
      this.ortho.top = top;
      this.ortho.bottom = bottom;
    }

    this.log("Parsed views");

    return null;
  }

  /**
  * Parses the <ambient> block.
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
      // Reads r, g, b and a
      var r = this.reader.getFloat(children[ambientIndex], 'r');
      var g = this.reader.getFloat(children[ambientIndex], 'g');
      var b = this.reader.getFloat(children[ambientIndex], 'b');
      var a = this.reader.getFloat(children[ambientIndex], 'a');

      // Validates r, g, b and a values
      if(r == null || g == null || b == null || a == null)
        return "unable to parse r, g, b and a components (null) on the <ambient> node from the <ambient> block";
      else if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
        return "unable to parse r, g, b and a components (NaN) on the <ambient> node from the <ambient> block";
      else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
        return "unable to parse r, g, b and a components (out of 0.0-1.0 range) on the <ambient> node from the <ambient> block";

      // Sets r, g, b and a
      this.ambient.r = r;
      this.ambient.g = g;
      this.ambient.b = b;
      this.ambient.a = a;
    }
    else
      return "<ambient> node is not defined on the <ambient> block";

    //Reads background node
    if(backgroundIndex != -1){
      // Reads r, g, b and a
      var r = this.reader.getFloat(children[backgroundIndex], 'r');
      var g = this.reader.getFloat(children[backgroundIndex], 'g');
      var b = this.reader.getFloat(children[backgroundIndex], 'b');
      var a = this.reader.getFloat(children[backgroundIndex], 'a');

      // Validates r, g, b and a values
      if(r == null || g == null || b == null || a == null)
        return "unable to parse r, g, b and a components (null) on the <background> node from the <ambient> block";
      else if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
        return "unable to parse r, g, b and a components (NaN) on the <background> node from the <ambient> block";
      else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
        return "unable to parse r, g, b and a components (out of 0.0-1.0 range) on the <background> node from the <ambient> block";

      // Sets r, g, b and a
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

    // Creates variables
    this.omni = [];
    this.spot = [];
    var omniCounter = 0;
    var spotCounter = 0;

    // Reads omni amd spot lights
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "omni"){
        // Reads omni children and node names
        var omniChildren = children[i].children;
        var omniNodeNames = [];
        for (var j = 0; j < omniChildren.length; j++)
          omniNodeNames.push(omniChildren[j].nodeName);

        // Creates variable
        this.omni[omniCounter] = [];

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
        for(var j = 0; j < this.omni.length; j++)
          if(id == this.omni[j].id)
            return "id '" + id + "' on the <omni> node with index " + i + " from the <lights> block is not unique";

        // Sets id and enabled
        this.omni[omniCounter].id = id;
        this.omni[omniCounter].enabled = enabled;

        // Gets indexes of location, ambient, diffuse and specular
        var locationIndex = omniNodeNames.indexOf("location");
        var ambientIndex = omniNodeNames.indexOf("ambient");
        var diffuseIndex = omniNodeNames.indexOf("diffuse");
        var specularIndex = omniNodeNames.indexOf("specular");

        // Reads location tag
        if(locationIndex != -1){
          // Creates variable
          this.omni[omniCounter].location = [];

          // Reads x, y, z, and w
          var x = this.reader.getFloat(omniChildren[locationIndex], 'x');
          var y = this.reader.getFloat(omniChildren[locationIndex], 'y');
          var z = this.reader.getFloat(omniChildren[locationIndex], 'z');
          var w = this.reader.getFloat(omniChildren[locationIndex], 'w');

          // Validates x, y, z, and w
          if(isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w))
            return "unable to parse x, y, z and w component (NaN) on tag <location> from the <omni> node with index " + i + " from the <lights> block";
          else if(x == null || y == null || z == null || w == null)
            return "unable to parse x, y, z and w component (null) on tag <location> from the <omni> node with index " + i + " from the <lights> block";

          // Sets x, y, z and w
          this.omni[omniCounter].location.x = x;
          this.omni[omniCounter].location.y = y;
          this.omni[omniCounter].location.z = z;
          this.omni[omniCounter].location.w = w;
        }
        else
          return "tag <location> is not defined on the <omni> node with index " + i + " from the <lights> block";

        // Reads ambient tag
        if(ambientIndex != -1){
          // Creates variable
          this.omni[omniCounter].ambient = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(omniChildren[ambientIndex], 'r');
          var g = this.reader.getFloat(omniChildren[ambientIndex], 'g');
          var b = this.reader.getFloat(omniChildren[ambientIndex], 'b');
          var a = this.reader.getFloat(omniChildren[ambientIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <ambient> from the <omni> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <ambient> from the <omni> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <ambient> from the <omni> node with index " + i + " from the <lights> block";

          // Sets r, g, b and a
          this.omni[omniCounter].ambient.r = r;
          this.omni[omniCounter].ambient.g = g;
          this.omni[omniCounter].ambient.b = b;
          this.omni[omniCounter].ambient.a = a;
        }
        else
          return "tag <ambient> is not defined on the <omni> node with index " + i + " from the <lights> block";

        // Reads diffuse tag
        if(diffuseIndex != -1){
          // Creates variable
          this.omni[omniCounter].diffuse = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(omniChildren[diffuseIndex], 'r');
          var g = this.reader.getFloat(omniChildren[diffuseIndex], 'g');
          var b = this.reader.getFloat(omniChildren[diffuseIndex], 'b');
          var a = this.reader.getFloat(omniChildren[diffuseIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <diffuse> from the <omni> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <diffuse> from the <omni> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <diffuse> from the <omni> node with index " + i + " from the <lights> block";

          // Sets r, g, b and a
          this.omni[omniCounter].diffuse.r = r;
          this.omni[omniCounter].diffuse.g = g;
          this.omni[omniCounter].diffuse.b = b;
          this.omni[omniCounter].diffuse.a = a;
        }
        else
          return "tag <diffuse> is not defined on the <omni> node with index " + i + " from the <lights> block";


        // Reads specular tag
        if(specularIndex != -1){
          // Creates variable
          this.omni[omniCounter].specular = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(omniChildren[specularIndex], 'r');
          var g = this.reader.getFloat(omniChildren[specularIndex], 'g');
          var b = this.reader.getFloat(omniChildren[specularIndex], 'b');
          var a = this.reader.getFloat(omniChildren[specularIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <specular> from the <omni> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <specular> from the <omni> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <specular> from the <omni> node with index " + i + " from the <lights> block";

          // Sets r, g, b and a
          this.omni[omniCounter].specular.r = r;
          this.omni[omniCounter].specular.g = g;
          this.omni[omniCounter].specular.b = b;
          this.omni[omniCounter].specular.a = a;
        }
        else
          return "tag <specular> is not defined on the <omni> node with index " + i + " from the <lights> block";

        // Increments omni lights counter
        omniCounter++;
      }
      else if(children[i].nodeName == "spot"){
        // Reads spot children and node names
        var spotChildren = children[i].children;
        var spotNodeNames = [];
        for (var j = 0; j < spotChildren.length; j++)
          spotNodeNames.push(spotChildren[j].nodeName);

        // Creates variable
        this.spot[spotCounter] = [];

        // Reads id, enabled, angle and exponent
        var id = this.reader.getString(children[i], 'id');
        var enabled = this.reader.getFloat(children[i], 'enabled');
        var angle = this.reader.getFloat(children[i], 'angle');
        var exponent = this.reader.getFloat(children[i], 'exponent');

        // Validates id, enabled, angle and exponent
        if(id == null || enabled == null || angle == null || exponent == null)
          return "unable to parse id, enabled, angle and exponent components (null) on the <spot> node with index " + i + " from the <lights> block";
        else if(isNaN(enabled) || isNaN(angle) || isNaN(exponent))
          return "unable to parse enabled, angle and exponent components (NaN) on the <spot> node with index " + i + " from the <lights> block";
        else if(enabled != 0 && enabled != 1)
          return "unable to parse enabled component (not valid - should be 0 or 1) on the <spot> node with index " + i + " from the <lights> block";

        // Checks if id is unique
        for(var j = 0; j < this.spot.length; j++)
          if(id == this.spot[j].id)
            return "id '" + id + "' on the <spot> node with index " + i + " from the <lights> block is not unique";

        // Sets id, enabled, angle and exponent
        this.spot[spotCounter].id = id;
        this.spot[spotCounter].enabled = enabled;
        this.spot[spotCounter].angle = angle;
        this.spot[spotCounter].exponent = exponent;

        // Gets indexes of location, target ambient, diffuse and specular
        var locationIndex = spotNodeNames.indexOf("location");
        var targetIndex = spotNodeNames.indexOf("target");
        var ambientIndex = spotNodeNames.indexOf("ambient");
        var diffuseIndex = spotNodeNames.indexOf("diffuse");
        var specularIndex = spotNodeNames.indexOf("specular");

        // Reads location tag
        if(locationIndex != -1){
          // Creates variable
          this.spot[spotCounter].location = [];

          // Reads x, y, z, and w
          var x = this.reader.getFloat(spotChildren[locationIndex], 'x');
          var y = this.reader.getFloat(spotChildren[locationIndex], 'y');
          var z = this.reader.getFloat(spotChildren[locationIndex], 'z');
          var w = this.reader.getFloat(spotChildren[locationIndex], 'w');

          // Validates x, y, z, and w
          if(isNaN(x) || isNaN(y) || isNaN(z) || isNaN(w))
            return "unable to parse x, y, z and w component (NaN) on tag <location> from the <spot> node with index " + i + " from the <lights> block";
          else if(x == null || y == null || z == null || w == null)
            return "unable to parse x, y, z and w component (null) on tag <location> from the <spot> node with index " + i + " from the <lights> block";

          // Sets x, y, z and w
          this.spot[spotCounter].location.x = x;
          this.spot[spotCounter].location.y = y;
          this.spot[spotCounter].location.z = z;
          this.spot[spotCounter].location.w = w;
        }
        else
          return "tag <location> is not defined on the <spot> node with index " + i + " from the <lights> block";

        // Reads target tag
        if(targetIndex != -1){
          // Creates variable
          this.spot[spotCounter].target = [];

          // Reads x, y, z, and w
          var x = this.reader.getFloat(spotChildren[targetIndex], 'x');
          var y = this.reader.getFloat(spotChildren[targetIndex], 'y');
          var z = this.reader.getFloat(spotChildren[targetIndex], 'z');

          // Validates x, y and z
          if(isNaN(x) || isNaN(y) || isNaN(z))
            return "unable to parse x, y and z component (NaN) on tag <target> from the <spot> node with index " + i + " from the <lights> block";
          else if(x == null || y == null || z == null)
            return "unable to parse x, y and z component (null) on tag <target> from the <spot> node with index " + i + " from the <lights> block";

          // Sets x, y, z and w
          this.spot[spotCounter].target.x = x;
          this.spot[spotCounter].target.y = y;
          this.spot[spotCounter].target.z = z;
        }
        else
          return "tag <target> is not defined on the <spot> node with index " + i + " from the <lights> block";

        // Reads ambient tag
        if(ambientIndex != -1){
          // Creates variable
          this.spot[spotCounter].ambient = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(spotChildren[ambientIndex], 'r');
          var g = this.reader.getFloat(spotChildren[ambientIndex], 'g');
          var b = this.reader.getFloat(spotChildren[ambientIndex], 'b');
          var a = this.reader.getFloat(spotChildren[ambientIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <ambient> from the <spot> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <ambient> from the <spot> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <ambient> from the <spot> node with index " + i + " from the <lights> block";

          // Sets r, g, b and a
          this.spot[spotCounter].ambient.r = r;
          this.spot[spotCounter].ambient.g = g;
          this.spot[spotCounter].ambient.b = b;
          this.spot[spotCounter].ambient.a = a;
        }
        else
          return "tag <ambient> is not defined on the <spot> node with index " + i + " from the <lights> block";

        // Reads diffuse tag
        if(diffuseIndex != -1){
          // Creates variable
          this.spot[spotCounter].diffuse = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(spotChildren[diffuseIndex], 'r');
          var g = this.reader.getFloat(spotChildren[diffuseIndex], 'g');
          var b = this.reader.getFloat(spotChildren[diffuseIndex], 'b');
          var a = this.reader.getFloat(spotChildren[diffuseIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <diffuse> from the <spot> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <diffuse> from the <spot> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <diffuse> from the <spot> node with index " + i + " from the <lights> block";

          // Sets r, g, b and a
          this.spot[spotCounter].diffuse.r = r;
          this.spot[spotCounter].diffuse.g = g;
          this.spot[spotCounter].diffuse.b = b;
          this.spot[spotCounter].diffuse.a = a;
        }
        else
          return "tag <diffuse> is not defined on the <spot> node with index " + i + " from the <lights> block";

        // Reads specular tag
        if(specularIndex != -1){
          // Creates variable
          this.spot[spotCounter].specular = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(spotChildren[specularIndex], 'r');
          var g = this.reader.getFloat(spotChildren[specularIndex], 'g');
          var b = this.reader.getFloat(spotChildren[specularIndex], 'b');
          var a = this.reader.getFloat(spotChildren[specularIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <specular> from the <spot> node with index " + i + " from the <lights> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <specular> from the <spot> node with index " + i + " from the <lights> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <specular> from the <spot> node with index " + i + " from the <lights> block";

          // Sets r, g, b and a
          this.spot[spotCounter].specular.r = r;
          this.spot[spotCounter].specular.g = g;
          this.spot[spotCounter].specular.b = b;
          this.spot[spotCounter].specular.a = a;
        }
        else
          return "tag <specular> is not defined on the <spot> node with index " + i + " from the <lights> block";

        // Increments spot lights counter
        spotCounter++;
      }
      else
        this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <lights> block");
    }

    this.log("Parsed lights");
    return null;
  }

  /**
  * Parses the <textures> block.
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
    var textureCounter = 0;

    // Reads textures
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "texture"){
      // Creates variable
      this.textures[textureCounter] = [];

      // Reads id and file
      var id = this.reader.getString(children[i], 'id');
      var file = this.reader.getString(children[i], 'file');

      // Validates id and file
      if(id == null || file == null)
        return "unable to parse id and file components (null) on the <texture> node with index " + i + " from the <textures> block";

      // Checks if id is unique
      for(var j = 0; j < this.textures.length; j++)
        if(id == this.textures[j].id)
          return "id '" + id + "' on the <texture> node with index " + i + " from the <textures> block is not unique";

      // Sets id and file
      this.textures[textureCounter].id = id;
      this.textures[textureCounter].file = file;

      // Increments texture counter
      textureCounter++;
    }
    else
      this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <textures> block");
    }

    this.log("Parsed textures");
    return null;
  }

  /**
  * Parses the <materials> block.
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
    var materialCounter = 0;

    // Reads materials
    for (var i = 0; i < children.length; i++){
      if(children[i].nodeName == "material"){

        // Reads material children and node names
        var materialChildren = children[i].children;
        var materialNodeNames = [];
        for (var j = 0; j < materialChildren.length; j++)
          materialNodeNames.push(materialChildren[j].nodeName);

        // Creates variable
        this.materials[materialCounter] = [];

        // Reads id and shininess
        var id = this.reader.getString(children[i], 'id');
        var shininess = this.reader.getFloat(children[i], 'shininess');

        // Validates id and shininess
        if(id == null || shininess == null)
          return "unable to parse id and shininess components (null) on the <material> node with index " + i + " from the <materials> block";
        else if(isNaN(shininess))
          return "unable to parse shininess component (NaN) on the <material> node with index " + i + " from the <materials> block";

        // Verifies if the id is unique
        for(var j = 0; j < this.materials.length; j++)
          if(id == this.materials[j].id)
            return "id '" + id + "' on the <material> node with index " + i + " from the <materials> block is not unique";

        // Sets id and shininess
        this.materials[materialCounter].id = id;
        this.materials[materialCounter].shininess = shininess;

        // Gets indexes of emission, ambient, diffuse and specular
        var emissionIndex = materialNodeNames.indexOf("emission");
        var ambientIndex = materialNodeNames.indexOf("ambient");
        var diffuseIndex = materialNodeNames.indexOf("diffuse");
        var specularIndex = materialNodeNames.indexOf("specular");

        // Reads emission tag
        if(emissionIndex != -1){
          // Creates variable
          this.materials[materialCounter].emission = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(materialChildren[emissionIndex], 'r');
          var g = this.reader.getFloat(materialChildren[emissionIndex], 'g');
          var b = this.reader.getFloat(materialChildren[emissionIndex], 'b');
          var a = this.reader.getFloat(materialChildren[emissionIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <emission> from the <material> node with index " + i + " from the <materials> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <emission> from the <material> node with index " + i + " from the <materials> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <emission> from the <material> node with index " + i + " from the <materials> block";

          // Sets r, g, b and a
          this.materials[materialCounter].emission.r = r;
          this.materials[materialCounter].emission.g = g;
          this.materials[materialCounter].emission.b = b;
          this.materials[materialCounter].emission.a = a;
        }
        else
          return "tag <emission> is not defined on the <material> node with index " + i + " from the <materials> block";


        // Reads ambient tag
        if(ambientIndex != -1){
          // Creates variable
          this.materials[materialCounter].ambient = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(materialChildren[ambientIndex], 'r');
          var g = this.reader.getFloat(materialChildren[ambientIndex], 'g');
          var b = this.reader.getFloat(materialChildren[ambientIndex], 'b');
          var a = this.reader.getFloat(materialChildren[ambientIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <ambient> from the <material> node with index " + i + " from the <materials> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <ambient> from the <material> node with index " + i + " from the <materials> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <ambient> from the <material> node with index " + i + " from the <materials> block";

          // Sets r, g, b and a
          this.materials[materialCounter].ambient.r = r;
          this.materials[materialCounter].ambient.g = g;
          this.materials[materialCounter].ambient.b = b;
          this.materials[materialCounter].ambient.a = a;
        }
        else
          return "tag <ambient> is not defined on the <material> node with index " + i + " from the <materials> block";


        // Reads diffuse tag
        if(diffuseIndex != -1){
          // Creates variable
          this.materials[materialCounter].diffuse = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(materialChildren[diffuseIndex], 'r');
          var g = this.reader.getFloat(materialChildren[diffuseIndex], 'g');
          var b = this.reader.getFloat(materialChildren[diffuseIndex], 'b');
          var a = this.reader.getFloat(materialChildren[diffuseIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <diffuse> from the <material> node with index " + i + " from the <materials> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <diffuse> from the <material> node with index " + i + " from the <materials> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <diffuse> from the <material> node with index " + i + " from the <materials> block";

          // Sets r, g, b and a
          this.materials[materialCounter].diffuse.r = r;
          this.materials[materialCounter].diffuse.g = g;
          this.materials[materialCounter].diffuse.b = b;
          this.materials[materialCounter].diffuse.a = a;
        }
        else
          return "tag <diffuse> is not defined on the <material> node with index " + i + " from the <materials> block";


        // Reads specular tag
        if(specularIndex != -1){
          // Creates variable
          this.materials[materialCounter].specular = [];

          // Reads r, g, b and a
          var r = this.reader.getFloat(materialChildren[specularIndex], 'r');
          var g = this.reader.getFloat(materialChildren[specularIndex], 'g');
          var b = this.reader.getFloat(materialChildren[specularIndex], 'b');
          var a = this.reader.getFloat(materialChildren[specularIndex], 'a');

          // Validates r, g, b and a
          if(isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a))
            return "unable to parse r, g, b and a component (NaN) on tag <specular> from the <material> node with index " + i + " from the <materials> block";
          else if(r == null || g == null || b == null || a == null)
            return "unable to parse r, g, b and a component (null) on tag <specular> from the <material> node with index " + i + " from the <materials> block";
          else if(r > 1 || r < 0 || g > 1 || g < 0 || b > 1 || b < 0 || a > 1 || a < 0)
            return "unable to parse r, g, b and a component (out of 0.0-1.0 range) on tag <specular> from the <material> node with index " + i + " from the <materials> block";

          // Sets r, g, b and a
          this.materials[materialCounter].specular.r = r;
          this.materials[materialCounter].specular.g = g;
          this.materials[materialCounter].specular.b = b;
          this.materials[materialCounter].specular.a = a;
        }
        else
          return "tag <specular> is not defined on the <material> node with index " + i + " from the <materials> block";

        // Increments material counter
        materialCounter++;
      }
      else
        this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <materials> block");
      }

    this.log("Parsed materials");
    return null;
  }

  /**
  * Parses the <transformations> block.
  */
  parseTransformations(transformationsNode) {

    // Reads transformations children and node names
    var children = transformationsNode.children;
    var nodeNames = [];
    for (var i = 0; i < children.length; i++)
      nodeNames.push(children[i].nodeName);

    // Checks if there are any materials defined
    if(transformationsNode.getElementsByTagName('transformation').length == 0)
      return "at least one <transformation> on the <transformations> block";

    // Creates variables
    this.transformations = [];
    var transformationCounter = 0;

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

        // Creates variables
        this.transformations[transformationCounter] = [];

        // Reads id
        var id = this.reader.getString(children[i], 'id');

        // Validates id
        if(id == null)
          return "unable to parse id component (null) on the <transformation> node with index " + i + " from the <transformations> block";

        // Checks if id is unique
        for(var j = 0; j < this.transformations.length; j++)
          if(id == this.transformations[j].id)
            return "id '" + id + "' on the <transformation> node with index " + i + " from the <transformations> block is not unique";

        // Sets id
        this.transformations[transformationCounter].id = id;

        // Create variables
        // INICIALIZAR MATRIZ IDENTIDADE

        for (var j = 0; j < transformationChildren.length; j++){
            if(transformationChildren[j].nodeName == "translate"){
              // Reads x, y, and z
              var x = this.reader.getFloat(transformationChildren[j], 'x');
              var y = this.reader.getFloat(transformationChildren[j], 'y');
              var z = this.reader.getFloat(transformationChildren[j], 'z');

              // Validates x, y, and z
              if(isNaN(x) || isNaN(y) || isNaN(z))
                return "unable to parse x, y and z components (NaN) on tag <translate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
              else if(x == null || y == null || z == null)
                return "unable to parse x, y and z components (null) on tag <translate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
            }
            else if(transformationChildren[j].nodeName == "rotate"){
              // Reads axis and angle
              var axis = this.reader.getString(transformationChildren[j], 'axis');
              var angle = this.reader.getFloat(transformationChildren[j], 'angle');

              // Validates axis and angle
              if(isNaN(angle))
                return "unable to parse angle component (NaN) on tag <rotate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
              else if(angle == null || axis == null)
                return "unable to parse axis and angle components (null) on tag <rotate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
              else if(axis != "x" && axis != "y" && axis != "z")
                return "unable to parse axis component (not valid - should be x, y or z) on tag <rotate> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
            }
            else if(transformationChildren[j].nodeName == "scale"){
              // Reads x, y, and z
              var x = this.reader.getFloat(transformationChildren[j], 'x');
              var y = this.reader.getFloat(transformationChildren[j], 'y');
              var z = this.reader.getFloat(transformationChildren[j], 'z');

              // Validates x, y, and z
              if(isNaN(x) || isNaN(y) || isNaN(z))
                return "unable to parse x, y and z components (NaN) on tag <scale> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
              else if(x == null || y == null || z == null)
                return "unable to parse x, y and z components (null) on tag <scale> with index " + j + " from the <transformation> node with index " + i + " from the <transformations> block";
            }
            else
              this.onXMLMinorError("tag <" + transformationChildren[j].nodeName + "> with index " + j + " from the <transformation> node with index " + i + " is not valid on the <transformations> block");
          }

          // Incremenets transformations counter
          transformationCounter++;
      }
      else
        this.onXMLMinorError("<" + children[i].nodeName + "> node with index " + i + " is not valid on the <transformations> block");
      }

    this.log("Parsed transformations");
    return null;
  }

  /**
  * Parses the <primitives> block.
  */
  parsePrimitives(primitivesNode) {
    var children = primitivesNode.children;

    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Checks if there are primitives defined
    if(primitivesNode.getElementsByTagName('primitive').length == 0)
    return "no primitives are defined on the primitives block";

    // Creates variables
    this.primitives = [];
    var primitiveCounter = 0;

    for (var i = 0; i < children.length; i++){
      var primitiveChildren = children[i].children;

      var primitiveNodeNames = [];

      for (var j = 0; j < primitiveChildren.length; j++)
      primitiveNodeNames.push(primitiveChildren[j].nodeName);

      // Checks if there's at most one of rectangle, triangle, cylinder, sphere and torus
      if(children[i].children.length > 1)
      return "no more than one rectangle, triangle, cylinder, sphere or torus should be defined on the primitives block";
      else if(children[i].children.length == 0)
      return "no primitive (rectangle, triangle, sphere, cylinder, torus) is defined on one of the primitives";


      this.primitives[primitiveCounter] = [];

      var id = this.reader.getString(children[i], 'id');

      // Verifies if the id is unique
      for(var j = 0; j < this.primitives.length; j++){
        if(id == this.primitives[j].id)
        return "there can't be two primitives with the same id";
      }

      this.primitives[primitiveCounter].id = id;

      if(children[i].children[0].nodeName == "rectangle"){
        this.primitives[primitiveCounter].rectangle = [];
        this.primitives[primitiveCounter].type = "rectangle";

        var x1 = this.reader.getFloat(children[i].children[0], 'x1');
        var x2 = this.reader.getFloat(children[i].children[0], 'x2');
        var y1 = this.reader.getFloat(children[i].children[0], 'y1');
        var y2 = this.reader.getFloat(children[i].children[0], 'y2');

        if(isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2))
        return "x1, x2, y1, y2 should be numeric values on the rectangle primitive"
        else if(x1 == null || x2 == null || y1 == null || y2 == null)
        return "not able to parse x1, x2, y1, y2 values on the rectangle primitive"

        this.primitives[primitiveCounter].x1 = x1;
        this.primitives[primitiveCounter].x2 = x2;
        this.primitives[primitiveCounter].y1 = y1;
        this.primitives[primitiveCounter].y2 = y2;
      }
      else if(children[i].children[0].nodeName == "triangle"){
        this.primitives[primitiveCounter].triangle = [];
        this.primitives[primitiveCounter].type = "triangle";

        var x1 = this.reader.getFloat(children[i].children[0], 'x1');
        var x2 = this.reader.getFloat(children[i].children[0], 'x2');
        var x3 = this.reader.getFloat(children[i].children[0], 'x3');
        var y1 = this.reader.getFloat(children[i].children[0], 'y1');
        var y2 = this.reader.getFloat(children[i].children[0], 'y2');
        var y3 = this.reader.getFloat(children[i].children[0], 'y3');
        var z1 = this.reader.getFloat(children[i].children[0], 'z1');
        var z2 = this.reader.getFloat(children[i].children[0], 'z2');
        var z3 = this.reader.getFloat(children[i].children[0], 'z3');

        if(isNaN(x1) || isNaN(x2) || isNaN(x3) || isNaN(y1) || isNaN(y2) || isNaN(y3) || isNaN(z1) || isNaN(z2) || isNaN(z3))
        return "x1, x2, x3, y1, y2, y3, z1, z2, z3 should be numeric values on the triangle primitive"
        else if(x1 == null || x2 == null ||  x3 == null || y1 == null || y2 == null || y3 == null ||  z1 == null || z2 == null || z3 == null)
        return "not able to parse x1, x2, x3, y1, y2, y3, z1, z2, z3 values on the triangle primitive"

        this.primitives[primitiveCounter].x1 = x1;
        this.primitives[primitiveCounter].x2 = x2;
        this.primitives[primitiveCounter].x3 = x3;
        this.primitives[primitiveCounter].y1 = y1;
        this.primitives[primitiveCounter].y2 = y2;
        this.primitives[primitiveCounter].y3 = y3;
        this.primitives[primitiveCounter].z1 = z1;
        this.primitives[primitiveCounter].z2 = z2;
        this.primitives[primitiveCounter].z3 = z3;
      }
      else if(children[i].children[0].nodeName == "cylinder"){
        this.primitives[primitiveCounter].cylinder = [];
        this.primitives[primitiveCounter].type = "cylinder";

        var base = this.reader.getFloat(children[i].children[0], 'base');
        var top = this.reader.getFloat(children[i].children[0], 'top');
        var height = this.reader.getFloat(children[i].children[0], 'height');
        var slices = this.reader.getInteger(children[i].children[0], 'slices');
        var stacks = this.reader.getInteger(children[i].children[0], 'stacks');


        if(isNaN(base) || isNaN(top) || isNaN(height) || isNaN(slices) || isNaN(stacks))
        return "base, top, height, slices, stacks should be numeric values on the cylinder primitive"
        else if(base == null || top == null || height == null || slices == null || stacks == null)
        return "not able to parse base, top, height, slices, stacks values on the cylinder primitive"
        else if(slices < 1 || stacks < 1)
        return "slices and stacks should be an integer value greater or equal to 1 on the cylinder primitive"

        this.primitives[primitiveCounter].base = base;
        this.primitives[primitiveCounter].height = height;
        this.primitives[primitiveCounter].top = top;
        this.primitives[primitiveCounter].stacks = stacks;
        this.primitives[primitiveCounter].slices = slices;
      }
      else if(children[i].children[0].nodeName == "sphere"){
        this.primitives[primitiveCounter].sphere = [];
        this.primitives[primitiveCounter].type = "sphere";

        var radius = this.reader.getFloat(children[i].children[0], 'radius');
        var slices = this.reader.getInteger(children[i].children[0], 'slices');
        var stacks = this.reader.getInteger(children[i].children[0], 'stacks');


        if(isNaN(radius) || isNaN(slices) || isNaN(stacks))
        return "radius, slices, stacks should be numeric values on the sphere primitive"
        else if(radius == null || slices == null || stacks == null)
        return "not able to parse radius, slices, stacks values on the sphere primitive"
        else if(slices < 1 || stacks < 1)
        return "slices and stacks should be an integer value greater or equal to 1 on the sphere primitive"
        else if(radius <= 0)
        return "radius should be an integer value greater to 0 on the sphere primitive"

        this.primitives[primitiveCounter].radius = radius;
        this.primitives[primitiveCounter].stacks = stacks;
        this.primitives[primitiveCounter].slices = slices;
      }
      else if(children[i].children[0].nodeName == "torus"){
        this.primitives[primitiveCounter].sphere = [];
        this.primitives[primitiveCounter].type = "torus";

        var inner = this.reader.getFloat(children[i].children[0], 'inner');
        var outer = this.reader.getFloat(children[i].children[0], 'outer');
        var slices = this.reader.getInteger(children[i].children[0], 'slices');
        var loops = this.reader.getInteger(children[i].children[0], 'loops');


        if(isNaN(inner) || isNaN(outer) || isNaN(slices) || isNaN(loops))
        return "inner, outer, slices, loops should be numeric values on the torus primitive"
        else if(inner == null || outer == null || slices == null || loops == null)
        return "not able to parse inner, outer, slices, loops values on the torus primitive"
        else if(slices < 1 || stacks < 1)
        return "slices and loops should be an integer value greater or equal to 1 on the torus primitive"
        else if(inner < 0 || outer <= 0 || inner == outer)
        return "inner and outer should be an integer value greater to 0 and can't be the same value on the torus primitive"

        this.primitives[primitiveCounter].inner = inner;
        this.primitives[primitiveCounter].outer = outer;
        this.primitives[primitiveCounter].slices = slices;
        this.primitives[primitiveCounter].loops = loops;
      }

      primitiveCounter++;
    }

    this.log("Parsed primitives");
    return null;
  }

  /**
  * Parses the <components> block.
  */
  parseComponents(componentsNode) {
    var children = componentsNode.children;

    var nodeNames = [];

    for (var i = 0; i < children.length; i++)
    nodeNames.push(children[i].nodeName);

    // Checks if there are components defined
    if(componentsNode.getElementsByTagName('component').length == 0)
    return "no components are defined on the components block";

    // Creates variables
    this.components = [];
    var componentCounter = 0;

    for (var i = 0; i < children.length; i++){
      var componentChildren = children[i].children;

      var componentNodeNames = [];

      for (var j = 0; j < componentChildren.length; j++)
      componentNodeNames.push(componentChildren[j].nodeName);

      this.components[componentCounter] = [];

      var id = this.reader.getString(children[i], 'id');

      // Verifies if the id is unique
      for(var j = 0; j < this.components.length; j++){
        if(id == this.components[j].id)
        return "there can't be two components with the same id";
      }

      this.components[componentCounter].id = id;

      // Gets indice of transformation, materials, texture and children
      var transformationIndex = componentNodeNames.indexOf("transformation");
      var materialsIndex = componentNodeNames.indexOf("materials");
      var textureIndex = componentNodeNames.indexOf("texture");
      var childrenIndex = componentNodeNames.indexOf("children");

      if(transformationIndex != -1){
        this.components[componentCounter].transformation = [];

        if(componentChildren[transformationIndex].children.length != 0)
        if(componentChildren[transformationIndex].getElementsByTagName("transformationref").length == 1){ // transformation reference
          var id = this.reader.getString(componentChildren[transformationIndex].children[0], 'id');

          var idCheck = 0;

          for(var j = 0; j < this.transformations.length; j++)
          if(id == this.transformations[j].id)
          idCheck = 1;

          if(idCheck == 1)
          this.components[componentCounter].transformation.id = id;
          else if(idCheck == 0)
          return "transformation ref not found"
        }
        else if (componentChildren[transformationIndex].getElementsByTagName("rotate").length > 0 || componentChildren[transformationIndex].getElementsByTagName("translate").length > 0 ||componentChildren[transformationIndex].getElementsByTagName("scale").length > 0){ // explicit transformation
          var transformationChildren = componentChildren[transformationIndex].children;

          var transformationNodeNames = [];

          for (var j = 0; j < transformationChildren.length; j++)
          transformationNodeNames.push(transformationChildren[j].nodeName);

          this.components[componentCounter].transformation.instructions = [];

          for(var j = 0; j < transformationChildren.length; j++){
            this.components[componentCounter].transformation.instructions[j] = [];
            if(transformationNodeNames[j] == "translate"){

              var x = this.reader.getFloat(transformationChildren[j], 'x');
              var y = this.reader.getFloat(transformationChildren[j], 'y');
              var z = this.reader.getFloat(transformationChildren[j], 'z');


              if(isNaN(x) || isNaN(y) || isNaN(z))
              return "translation should be numeric values on the transformation node from the components block";

              this.components[componentCounter].transformation.instructions[j].type = "translate";

              if(x == null || y == null || z == null){
                this.components[componentCounter].transformation.instructions[j].x = 0;
                this.components[componentCounter].transformation.instructions[j].y = 0;
                this.components[componentCounter].transformation.instructions[j].z = 0;
                this.onXMLMinorError("unable to parse transformation translation; assuming (0,0,0)");
              }
              else{
                this.components[componentCounter].transformation.instructions[j].x = x;
                this.components[componentCounter].transformation.instructions[j].y = y;
                this.components[componentCounter].transformation.instructions[j].z = z;
              }
            }
            else if(transformationNodeNames[j] == "rotate"){
              var axis = this.reader.getString(transformationChildren[j], 'axis');
              var angle = this.reader.getFloat(transformationChildren[j], 'angle');

              if(isNaN(angle))
              return "rotation angle should be numeric values on the transformation node from the components block";
              else if(angle < 0 || angle > 360)
              return "rotation angle should be a numeric value between 0 and 360"
              else if(axis != "x" && axis != "y" && axis != "z")
              return "rotation axis should be x, y or z";

              this.components[componentCounter].transformation.instructions[j].type = "rotate";

              if(axis == null || angle == null){
                this.components[componentCounter].transformation.instructions[j].axis = "x";
                this.components[componentCounter].transformation.instructions[j].angle = 0;
                this.onXMLMinorError("unable to parse transformation rotation; assuming axis=x and angle=0");
              }
              else{
                this.components[componentCounter].transformation.instructions[j].axis = axis;
                this.components[componentCounter].transformation.instructions[j].angle = angle;
              }
            }
            else if(transformationNodeNames[j] == "scale"){
              var x = this.reader.getFloat(transformationChildren[j], 'x');
              var y = this.reader.getFloat(transformationChildren[j], 'y');
              var z = this.reader.getFloat(transformationChildren[j], 'z');

              if(isNaN(x) || isNaN(y) || isNaN(z))
              return "scaling should be numeric values on the transformation node from the components block";

              this.components[componentCounter].transformation.instructions[j].type = "scale";


              if(x == null || y == null || z == null){
                this.components[componentCounter].transformation.instructions[j].x = 0;
                this.components[componentCounter].transformation.instructions[j].y = 0;
                this.components[componentCounter].transformation.instructions[j].z = 0;
                this.onXMLMinorError("unable to parse transformation scaling; assuming (0,0,0)");
              }
              else{
                this.components[componentCounter].transformation.instructions[j].x = x;
                this.components[componentCounter].transformation.instructions[j].y = y;
                this.components[componentCounter].transformation.instructions[j].z = z;
              }
            }

          }
        }
        else
        return "there can't be explicit and reference transformations at the same time on the component block";
      }
      else
      return "there needs to be a transformation block on the component block"

      if(materialsIndex != -1){
        this.components[componentCounter].materials = [];

        if(componentChildren[materialsIndex].children.length != 0){
          for(var k = 0; k < componentChildren[materialsIndex].children.length; k++){
            var id = this.reader.getString(componentChildren[materialsIndex].children[k], 'id');

            var idCheck = 0;

            for(var j = 0; j < this.materials.length; j++)
            if(id == this.materials[j].id)
            idCheck = 1;

            if(idCheck == 1 || id == "inherit"){
              this.components[componentCounter].materials[k] = [];
              this.components[componentCounter].materials[k].id = id;
            }
            else if(idCheck == 0)
            return "material ref not found";
          }
        }
        else
        return "at least on material must be defined on the materials node from the components block"
      }
      else
      return "there needs to be a materials block on the component block"

      if(textureIndex != -1){
        this.components[componentCounter].texture = [];

        var id = this.reader.getString(componentChildren[textureIndex], 'id');
        var length_s = this.reader.getFloat(componentChildren[textureIndex], 'length_s');
        var length_t = this.reader.getFloat(componentChildren[textureIndex], 'length_t');

        if(length_s < 0 || length_t < 0)
        return "length_s and length_t should be numeric values greater than 0 on the texture node from the components block";


        var idCheck = 0;

        for(var j = 0; j < this.textures.length; j++)
        if(id == this.textures[j].id)
        idCheck = 1;

        if(idCheck == 1 || id == "inherit" || id == "none"){
          this.components[componentCounter].texture.id = id;
          this.components[componentCounter].texture.length_s = length_s
          this.components[componentCounter].texture.length_t = length_t
        }
        else if(idCheck == 0)
        return "texture ref not found";
      }
      else
      return "there needs to be a textures block on the component block"

      if(childrenIndex != -1){
        if(componentChildren[childrenIndex].getElementsByTagName("componentref").length > 0 || componentChildren[childrenIndex].getElementsByTagName("primitiveref").length > 0){
          this.components[componentCounter].children = [];

          var childrenChildren = componentChildren[childrenIndex].children;

          var childrenNodeNames = [];

          for (var j = 0; j < childrenChildren.length; j++)
          childrenNodeNames.push(childrenChildren[j].nodeName);

          for (var j = 0; j < childrenNodeNames.length; j++){

            if(childrenNodeNames[j] == "componentref"){
              var id = this.reader.getString(childrenChildren[j], 'id');

              /* USAR FLAG PARA QUANDO O ID NAO EXISTE, CONFIRMAR SE EXISTE NO FIM
              var idCheck = 0;

              for(var j = 0; j < this.textures.length; j++)
              if(id == this.textures[j].id)
              idCheck = 1;
              */


              this.components[componentCounter].children[j] = [];
              this.components[componentCounter].children[j].type = "componentref";
              this.components[componentCounter].children[j].id = id;

            }
            else if(childrenNodeNames[j] == "primitiveref"){
              var id = this.reader.getString(childrenChildren[j], 'id');

              var idCheck = 0;

              for(var k = 0; k < this.primitives.length; k++)
              if(id == this.primitives[k].id)
              idCheck = 1;

              if(idCheck == 1){
                this.components[componentCounter].children[j] = [];
                this.components[componentCounter].children[j].type = "primitiveref";
                this.components[componentCounter].children[j].id = id;
              }
              else
              return "primitiveref not found on the components block"
            }
            else
            this.onXMLMinorError("unkknow tag on the components block")
          }
        }
        else
        return "there should be one or more componentref and/or primitiveref"

      }
      else
      return "there needs to be a textures block on the children block"

      componentCounter++;
    }

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
