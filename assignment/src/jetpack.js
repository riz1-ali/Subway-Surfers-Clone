/// <reference path="webgl.d.ts" />

jetpack = class {
    constructor(gl, pos) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        var n=6;
        var k=1;
        var pi=3.1415;
        var dn=n;
        var radius = 0.2;
        var flag = 0;
        this.positions = [];
        this.faceColors = [
            [1,0,0,1]
        ];
        var colors = [];
        var indices = [];
        for(var i=0;i<9*n;i+=3)
        {
            if(flag==0)
            {
                this.positions.push(0);
                this.positions.push(0);
                this.positions.push(0);	
                flag=1;
            }
            else if(flag==1)
            {
                this.positions.push(radius*Math.cos((pi*2*k)/dn));
                this.positions.push((radius*Math.sin((pi*2*k)/dn)));
                this.positions.push(0);
                flag=2;
            }
            else
            {
                var x;
                k==1?x=n:x=k-1;
                this.positions.push(radius*Math.cos((pi*2*x)/dn));
                this.positions.push((radius*Math.sin((pi*2*x)/dn)));
                this.positions.push(0);
                k++;
                flag=0;
            }
            indices.push(i);
            indices.push(i+1);
            indices.push(i+2);
            var c = this.faceColors[0];
            colors = colors.concat(c,c,c,c);
        }
        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        // for (var j = 0; j < this.faceColors.length; ++j) {
        //     const c = this.faceColors[j];

        //     // Repeat each color four times for the four vertices of the face
        //     colors = colors.concat(c, c, c, c);
        // }

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
            color: colorBuffer,
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
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.color);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexColor,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexColor);
        }

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
            const vertexCount = 6 + 18;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }

    detect_collision(pos_cube,edge){
        var dist=0;
        for(var i=0;i<3;i++)
            dist += (this.pos[i]-pos_cube[i])*(this.pos[i]-pos_cube[i]);
        if(dist < (edge/2)*(edge/2))
            return true;
        return false;
    }
};