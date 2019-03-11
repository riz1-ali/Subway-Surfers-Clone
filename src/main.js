var cubeRotation = 0.0;

main();

//
// Start here
//

var c;
var police;
var dogs;
var ground_piece;
var sky;
var coins;
var ground_obs;
var barr_obs;
var jet;
var rail1,rail2;
var wall_left,wall_right;
var spikes;
var trains;
var jump_boots;
var alt=0;
var grayscale = 0;
var flashing=0;
var magnets;
var legs_dog;
var legs_police;
var end_flags;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;


function keyDownHandler(event) {
  if(event.keyCode == 39) {
      rightPressed = true;
  }
  else if(event.keyCode == 37) {
      leftPressed = true;
  }
  if(event.keyCode == 40) {
    downPressed = true;
    if(c.down == 0)
        c.down = 1;
  }
  else if(event.keyCode == 38) {
    upPressed = true;
  }
}

function keyUpHandler(event) {
  if(event.keyCode == 39) {
      rightPressed = false;
  }
  else if(event.keyCode == 37) {
      leftPressed = false;
  }
  if(event.keyCode == 40) {
    downPressed = false;
    if(c.down == 1)
      c.down = 0;
  }
  else if(event.keyCode == 38) {
    upPressed = false;
  }
}

function main() {


  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  c = new cube(gl,[0,0.5,0],'./images/player.jpeg');
  end_flags = new end_flag(gl,[0,3.5,999],'./images/end_flag.png');
  police = new cube(gl,[0,1.8,4],'./images/police.jpeg');
  dogs = new dog(gl,[1,1,4],'./images/dog.jpeg')
  legs_dog=[];
  var l = new leg(gl,[0.9,0.8,3.9],0.02);
  legs_dog.push(l);
  l = new leg(gl,[0.9,0.8,4.1],0.02);
  l.val *= -1;
  legs_dog.push(l);
  l = new leg(gl,[1.1,0.8,3.9],0.02);
  legs_dog.push(l);
  l = new leg(gl,[1.1,0.8,4.1],0.02);
  l.val *= -1;
  legs_dog.push(l);

  legs_police = [];
  l = new leg(gl,[-0.1,1.2,4.1],0.06);
  l.val *= -1;
  legs_police.push(l);
  l = new leg(gl,[0.1,1.2,3.9],0.06);
  legs_police.push(l);
  
  ground_piece = [];
  for(var i=0;i<1000;i+=20)
  {
    var temp= new ground(gl,[0,0.1,i],'./images/ground_land.jpg');
    ground_piece.push(temp);
  }
  wall_left = [];
  for(var i=0;i<1000;i+=20)
  {
    var temp= new wall(gl,[4,1.6,i],'./images/brick_wall.jpeg');
    wall_left.push(temp);
  }
  wall_right = [];
  for(var i=0;i<1000;i+=20)
  {
    var temp= new wall(gl,[-6,1.6,i],'./images/brick_wall.jpeg');
    wall_right.push(temp);
  }
  sky = new sky(gl,[0,100,1000]);
  rail1 = [];
  for(var i=0;i<1000;i+=10){
    var temp = new rail(gl,[0,0.1,i],'./images/rail.jpg');
    rail1.push(temp)
  }
  rail2 = [];
  for(var i=0;i<1000;i+=10){
    var temp = new rail(gl,[-2,0.1,i],'./images/rail.jpg');
    rail2.push(temp)
  }
  jet = []
  for(var i=0;i<10;i++)
  {
    var temp = new jetpack(gl,[-2,0.5,i*100 + 13]);
    jet.push(temp);
  }
  jump_boots=[];
  for(var i=0;i<10;i++)
  {
    var temp = new super_jump(gl,[0,0.25,17+100*i],'./images/jump.png');
    jump_boots.push(temp);
  }
  magnets = [];
  for(var i=0;i<10;i++)
  {
    var temp = new magnet(gl,[0,0.25,19+100*i],'./images/magnet.jpeg');
    magnets.push(temp);
  }
  coins = [];
  for(var i=0;i<1000;i++)
  {
    var temp;
    if(i%2)
      temp = new coin(gl,[0,0.5,i+5*i+5]);
    else
      temp = new coin(gl,[-2,0.5,i+5*i+5]);
    coins.push(temp);
    if(i%2)
      temp = new coin(gl,[0,7,i+5*i+5]);
    else
      temp = new coin(gl,[-2,7,i+5*i+5]);
    coins.push(temp)
  }
  ground_obs = [];
  for(var i=0;i<100;i++)
  {
    var temp;
    if(i%2)
      temp = new obstacle_ground(gl,[0,0.5,i+5*i+10],c.edge*2,rail2[2].diff_rail,'./images/obstacle_ground.png');
    else
      temp = new obstacle_ground(gl,[-2,0.5,i+5*i+10],c.edge*2,rail2[0].diff_rail,'./images/obstacle_ground.png');
    ground_obs.push(temp);
  }
  barr_obs = [];
  for(var i=0;i<100;i++)
  {
    var temp;
    if(i%2)
      temp = new barrier(gl,[-2,1.3,i+6*i+11],c.edge*2,rail2[0].diff_rail,'./images/barrier.png');
    else
      temp = new barrier(gl,[0,1.3,i+6*i+11],c.edge*2,rail2[0].diff_rail,'./images/barrier.png');
    barr_obs.push(temp);
  }
  trains = [];
  for(var i=0;i<10;i++)
  {
    var temp;
      if(i%2==0)
        temp = new train(gl,[0,1.1,i*100 + 7],'./images/train.png');
      else
        temp = new train(gl,[-2,1.1,i*100 + 7],'./images/train.png');
      trains.push(temp);
  }
  spikes = []
  for(var i=0;i<10;i++)
  {
      var temp;
      if(i%2)
        temp = new spike(gl,[-2,0.5,i*10+11],'./images/spike.jpg');
      else
        temp = new spike(gl,[0,0.5,i*10+11],'./images/spike.jpg');
      spikes.push(temp);
  }
  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying highp vec2 vTextureCoord;

  void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`;

  // Fragment shader program

  const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  const fsSource_g = `
    precision mediump float;
    varying vec4 v_color;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main() 
    {
      vec3 color = texture2D(uSampler, vTextureCoord).rgb;
      float gray = (color.r + color.g + color.b) / 3.0;
      vec3 grayscale = vec3(gray);
      gl_FragColor = vec4(grayscale, 1.0);
    }
  `;

  const fsSource_f = `
  precision mediump float;
  varying vec4 v_color;
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  void main() 
  {
    vec3 color = texture2D(uSampler, vTextureCoord).rgb;
    gl_FragColor = vec4(color.r*1.5,color.g*1.5,color.b*1.5, 1.0);
  }
`;


  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const shaderProgram_g = initShaderProgram(gl, vsSource, fsSource_g);
  const shaderProgram_f = initShaderProgram(gl, vsSource, fsSource_f);

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };
  const programInfo_g = {
    program: shaderProgram_g,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram_g, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram_g, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram_g, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram_g, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram_g, 'uSampler'),
    },
  };
  const programInfo_f = {
    program: shaderProgram_f,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram_f, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram_f, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram_f, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram_f, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram_f, 'uSampler'),
    },
  };
  const vsSource_c = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  const fsSource_c = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;
  const shaderProgram_c = initShaderProgram(gl, vsSource_c, fsSource_c);
  const programInfo_c = {
    program: shaderProgram_c,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram_c, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram_c, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram_c, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram_c, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  //const buffers

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    if(c.pos[2] >= end_flags.pos[2])
      exit(0);
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    if(rightPressed) {
      c.move_right();
    }
    else if(leftPressed) {
      c.move_left();
    }
    if(upPressed){
      c.move_up();
    }
    tick_elements();
    drawScene_texture(gl, programInfo,programInfo_c,programInfo_g,programInfo_f, deltaTime);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
function drawScene_texture(gl, programInfo,programInfo_c,programInfo_g,programInfo_f,deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const fieldOfView = 60 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100000.0;
  const projectionMatrix = mat4.create();
  mat4.perspective(projectionMatrix,fieldOfView,aspect,zNear,zFar);

    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [2, 5, 0]);
    var cameraPosition=[
      c.pos[0],
      c.pos[1]+2.9,
      c.pos[2]-6,
    ];
    var up = [0, 1, 0];

    mat4.lookAt(cameraMatrix, cameraPosition, c.pos, up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();

    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
  if(grayscale==1){
    c.draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    end_flags.draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    police.draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    dogs.draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<ground_piece.length;i++)  
      ground_piece[i].draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<wall_left.length;i++)  
      wall_left[i].draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<wall_right.length;i++)  
      wall_right[i].draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<rail1.length;i++)  
      rail1[i].draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<rail2.length;i++)  
      rail2[i].draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<trains.length;i++)  
      trains[i].draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<spikes.length;i++)  
      spikes[i].draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<jump_boots.length;i++)  
      jump_boots[i].draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<magnets.length;i++)  
      magnets[i].draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
  }else if(flashing==1){
    setInterval(function(){alt = !alt},2000);
    // alt = !alt;
    if(alt){
    c.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    end_flags.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    police.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    dogs.draw(gl, viewProjectionMatrix, programInfo_g, deltaTime);
    for(var i=0;i<ground_piece.length;i++)  
      ground_piece[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<wall_left.length;i++)  
      wall_left[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<wall_right.length;i++)  
      wall_right[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<rail1.length;i++)  
      rail1[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<rail2.length;i++)  
      rail2[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<trains.length;i++)  
      trains[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<spikes.length;i++)  
      spikes[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<jump_boots.length;i++)  
      jump_boots[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    for(var i=0;i<magnets.length;i++)  
      magnets[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
    }else{
      c.draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      end_flags.draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      police.draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      dogs.draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      for(var i=0;i<ground_piece.length;i++)  
        ground_piece[i].draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      for(var i=0;i<wall_left.length;i++)  
        wall_left[i].draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      for(var i=0;i<wall_right.length;i++)  
        wall_right[i].draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      for(var i=0;i<rail1.length;i++)  
        rail1[i].draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      for(var i=0;i<rail2.length;i++)  
        rail2[i].draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      for(var i=0;i<trains.length;i++)  
        trains[i].draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      for(var i=0;i<spikes.length;i++)  
        spikes[i].draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      for(var i=0;i<jump_boots.length;i++)  
        jump_boots[i].draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
      for(var i=0;i<magnets.length;i++)  
        magnets[i].draw(gl, viewProjectionMatrix, programInfo_f, deltaTime);
    }
  }else{
  c.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  end_flags.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  police.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  dogs.draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<ground_piece.length;i++)  
    ground_piece[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<wall_left.length;i++)  
    wall_left[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<wall_right.length;i++)  
    wall_right[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<rail1.length;i++)  
    rail1[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<rail2.length;i++)  
    rail2[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<trains.length;i++)  
    trains[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<spikes.length;i++)  
    spikes[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<jump_boots.length;i++)  
    jump_boots[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<magnets.length;i++)  
    magnets[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  }
  for(var i=0;i<legs_dog.length;i++)
    legs_dog[i].draw(gl, viewProjectionMatrix, programInfo_c, deltaTime);
  for(var i=0;i<legs_police.length;i++)
    legs_police[i].draw(gl, viewProjectionMatrix, programInfo_c, deltaTime);
  sky.draw(gl, viewProjectionMatrix, programInfo_c, deltaTime);
  for(var i=0;i<coins.length;i++)
    coins[i].draw(gl, viewProjectionMatrix, programInfo_c, deltaTime);
  for(var i=0;i<ground_obs.length;i++)
    ground_obs[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<barr_obs.length;i++)
    barr_obs[i].draw(gl, viewProjectionMatrix, programInfo, deltaTime);
  for(var i=0;i<jet.length;i++)
    jet[i].draw(gl, viewProjectionMatrix, programInfo_c, deltaTime);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function tick_elements(){
  c.tick(downPressed);
  end_flags.pos[1] = c.pos[1] + 3;
  if(c.spike_time > 0)
  {
    police.speedz = 0.04;
    police.pos[0] = c.pos[0];
    police.pos[1] = 1.8;
    police.pos[2] = c.pos[2] - 4;
  }else{
    police.speedz -= 0.000001;
    if(police.speedz <=0.01)
      police.speedz = 0.04;
  }
  for(var i=0;i<3;i++)
    dogs.pos[i] = police.pos[i];
  dogs.pos[1] =1;
  dogs.pos[0] += 1;
  if(c.pos[0]==-2)
    dogs.pos[0]=-3;
  if(police.pos[2]!=c.pos[2]-4)
  {
    for(var i=0;i<3;i++)
      dogs.pos[i] = c.pos[i];
    dogs.pos[2] -=4;
    dogs.pos[1] =1;
  }
  for(var i=0;i<legs_dog.length;i++)
    legs_dog[i].tick();
  legs_dog[0].pos[0] = dogs.pos[0] - 0.1;
  legs_dog[1].pos[0] = dogs.pos[0] - 0.1;
  legs_dog[0].pos[2] = dogs.pos[2] - 0.1;
  legs_dog[1].pos[2] = dogs.pos[2] + 0.1;
  legs_dog[2].pos[0] = dogs.pos[0] + 0.1;
  legs_dog[3].pos[0] = dogs.pos[0] + 0.1;
  legs_dog[2].pos[2] = dogs.pos[2] - 0.1;
  legs_dog[3].pos[2] = dogs.pos[2] + 0.1;
  for(var i=0;i<legs_police.length;i++)
  {
    legs_police[i].tick();
    legs_police[i].pos[2]=police.pos[2];
  }
  legs_police[0].pos[0] = police.pos[0] - 0.1;
  legs_police[1].pos[0] = police.pos[0] + 0.1;
  var temp=[];
  for(var i=0;i<coins.length;i++)
    if(coins[i].detect_collision(c.pos,2*c.edge)==false)
      temp.push(coins[i]);
    else
      c.score += 1;
  coins=temp;
  temp=[];
  for(var i=0;i<jump_boots.length;i++)
    if(jump_boots[i].detect_collision(c.pos,2*c.edge)==false)
      temp.push(jump_boots[i]);
    else{
      c.jump_counter_limit = 60;
      c.super_jump_time = 300;
      c.speed_limit = 0.8;
    }
  jump_boots=temp;
  temp=[];
  for(var i=0;i<magnets.length;i++)
    if(magnets[i].detect_collision(c.pos,2*c.edge)==false)
      temp.push(magnets[i]);
    else{
      c.magnet_time = 500;
    }
  magnets=temp;
  if(c.magnet_time > 0){
    temp=[];
    for(var i=0;i<coins.length;i++)
      if(coins[i].detect_magnet_collision(c.pos)==false)
        temp.push(coins[i]);
      else
        c.score += 1;
    coins = temp;
  }
  temp=[];
  for(var i=0;i<jet.length;i++)
    if(jet[i].detect_collision(c.pos,2*c.edge)==false)
      temp.push(jet[i]);
    else
    {
      c.beg = c.pos[1];
      c.pos[1] = 7;
      c.speedz=1.3;
      c.key_freeze=1;
      c.jetpack_time = 200;
    }
  jet=temp;
  for(var i=0;i<ground_obs.length;i++)
    if(ground_obs[i].detect_collision(c.pos,2*c.edge)==true)
      exit(0);
  for(var i=0;i<barr_obs.length;i++)
    if(barr_obs[i].detect_collision(c.pos,2*c.edge)==true)
      exit(0);
  for(var i=0;i<trains.length;i++)
    if(trains[i].detect_collision(c.pos,2*c.edge)==true)
      exit(0);
  for(var i=0;i<spikes.length;i++)
    if(spikes[i].detect_collision(c.pos,2*c.edge)==true){
      if(c.spike_time <= 0){
        c.pos[2]+=0.3;
        c.spike_time = 300;
      }else
        exit(0);
    }
  for(var i=0;i<trains.length;i++)
  {
    var temp = trains[i].detect_up(c.pos,2*c.edge);
    if(temp==false){
      c.y_thresh = 0.5;
      c.train=false;
    }else{
      c.y_thresh = 3;
      c.train=true;
      break;
    }
  }
  document.getElementById("score_player").innerHTML = c.score;
}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

function Grayscale() {
    grayscale = true;
    flashing = false;
}

function Flashing() {
    flashing = true;
    grayscale = false;
}

function Normal() {
  flashing = false;
  grayscale = false;
}