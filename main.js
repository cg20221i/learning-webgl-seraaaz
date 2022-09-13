function main(){
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    /**
     * A (0.5, 0.5)
     * B (0.0, 0.0)
     * C (-0.5, 0.5)
     */
    var vertices = [
        0.5, 0.5, 
        0.0, 0.0, 
        -0.5, -0.5
    ];

    // create linked-list for storing the vertices data in the GPU realm

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    // VERTEX SHADER
    var vertexShaderCode= `
    attribute vec2 aPosition;
    void main(){
        gl_PointSize = 10.0;
        gl_Position = vec4(aPosition, 0.0, 1.0);
        //gl_Position is the final destination for storing positional data to rendered vertex

    }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    //FRAGMENT SHADER
    var fragmentShaderCode = `
    precision mediump float;
    void main(){
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }`;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

     // Comparing to C-Programming, we may imagine
    //  that up to this step we have created two
    //  object files (.o), for the vertex and fragment shaders

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    //Teach the computer (GPU) how to collect the positional values from ARRAY_BUFFER
    // for each vertex being processed

    var aPositon = gl.getAttribLocation(shaderProgram, "aPosition"); //put in CPU realm
    gl.vertexAttribPointer(aPositon, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPositon);

    gl.clearColor(1.0, 0.75, 0.79, 1.0);
                //red, Green, Blue, Alpha (transparancy)

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINT, 0, 3);

    //(mode, first, count);
}