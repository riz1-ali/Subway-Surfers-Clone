/// <reference path="webgl.d.ts" />

cube = class {
    constructor(gl, pos,url) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        this.time = 0;
        this.spike_time=300;
        this.edge = 0.25;
        this.rail_dir = 0;
        this.speed=0;
        this.accel=0;
        this.speedz=0.04;
        this.jump_cntr = 0;
        this.beg=0;
        this.score = 0;
        this.key_freeze = 0;
        this.jetpack_time=0;
        this.jump_counter_limit = 30;
        this.super_jump_time = 0;
        this.y_thresh = 0;
        this.down = false;
        this.jump = false;
        this.train = false;
        this.date = new Date();
        this.speed_limit = 0.4;
        this.accel_limit = -14;
        this.positions = [
	    // Front face
	    -this.edge, -this.edge,  this.edge,
	     this.edge, -this.edge,  this.edge,
	     this.edge,  this.edge,  this.edge,
	    -this.edge,  this.edge,  this.edge,

	    //Back Face

	    -this.edge, -this.edge,  -this.edge,
	     this.edge, -this.edge,  -this.edge,
	     this.edge,  this.edge,  -this.edge,
	    -this.edge,  this.edge,  -this.edge,
	  ];

        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        const textureCoordinates = [
            // Front
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Back
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Top
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Bottom
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Right
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
            // Left
            0.0,  0.0,
            1.0,  0.0,
            1.0,  1.0,
            0.0,  1.0,
        ];
        this.texture = loadTexture(gl,url);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),gl.STATIC_DRAW);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        const indices = [
	    0,  1,  2,      0,  2,  3,    // front
	    4,5,6, 4,6,7,
	    0,3,7, 0,7,4,
	    0,1,4, 1,4,5,
	    1,2,5, 2,5,6,
	    2,3,6, 3,6,7,
	  ];

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        }

    }

    draw(gl, projectionMatrix, programInfo, deltaTime) {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        //this.rotation += Math.PI / (((Math.random()) % 100) + 50);

        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [1, 1, 1]);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const num = 2; // every coordinate composed of 2 values
            const type = gl.FLOAT; // the data in the buffer is 32 bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        }
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
      
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        {
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
    move_right(){
        this.rail_dir = -1;
    }
    move_left(){
        this.rail_dir = 1;
    }
    move_up(){
        if(!this.jump)
        {
            this.speed = this.speed_limit;
            this.accel = this.accel_limit;
            this.jump_cntr = 1;
            this.beg = this.pos[1];
            this.jump = true;
        }
    }
    // move_down(){
        
    // }
    tick(down_key){
        this.pos[2] += this.speedz;
        this.pos[0] += 0.2*this.rail_dir;
        this.spike_time -=1;
        this.super_jump_time -= 1;
        if(this.super_jump_time == 0)
        {
            this.pos[1]=this.y_thresh;
            this.jump_counter_limit = 60;
            this.speed_limit /= 2;
        }
        if(!this.key_freeze)
        {
            if(this.jump)
            {
                this.pos[1] += this.speed + this.accel*(2*this.jump_cntr - 1)*0.001;
                this.jump_cntr += 1
            }
            if(this.jump_cntr == this.jump_counter_limit)
            {

                this.pos[1] = this.beg;
                this.jump = 0;
            }
            if(down_key){
                this.pos[1] = 0.25;
            }
            else
            {
                if(this.pos[1]<this.y_thresh)
                    this.pos[1]=this.y_thresh;
            }
            if(!c.train && this.pos[1]>=3 && !this.jump && !this.down)
                this.pos[1]=0.5;
        }
        else{
            this.jump=0;
            this.jetpack_time -= 1;
            if(this.jetpack_time == 0)
            {
                this.key_freeze = 0;
                this.pos[1] = 0.5;
                this.speedz = 0.04;
            }
        }
        if(this.pos[0]<-2)
            this.pos[0]=-2;
        if(this.pos[0]>0)
            this.pos[0]=0;
    };
};