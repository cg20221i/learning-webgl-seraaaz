function main(){
    var canvas = document.getElementById("myCanvas");
    var gl = canvas.getContext("webgl");

    /**
     * A (0.5, 0.5) Red (1.0 ,0.0, 0.0)
     * B (0.0, 0.0) Green (0.0, 1.0, 0.0)
     * C (-0.5, 0.5) Blue (0.0, 0.0, 1.0)
     * D (0.0, 1.0) Black (0.0, 0.0, 0.0)
     */
    var vertices = [
        0.5, 0.5, 1.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 1.0, 0.0,
        -0.5, 0.5, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 0.0, 0.0,
    ];

    // create linked-list for storing the vertices data in the GPU realm

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    // VERTEX SHADER
    var vertexShaderCode= `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    uniform float uTheta;
    varying vec3 vColor;
    void main(){
        gl_PointSize = 15.0;
        vec2 position; vec2(aPosition);
        position.x = -sin(uTheta) * aPosition.x + cos(uTheta) * aPosition.y;
        position.y = sin(uTheta) * aPosition.y + cos(uTheta) * aPosition.x;
        gl_Position = vec4(position, 0.0, 1.0);
        //gl_Position is the final destination for storing positional data to rendered vertex
        vColor = aColor;

    }
    `;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    //FRAGMENT SHADER
    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main(){
        gl_FragColor = vec4(vColor, 1.0);
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

    //local variables
    var isAnimated = false;
    var theta = 0.0; 

    //local functions

    function onMouseClick (event){
        isAnimated = !isAnimated;
    }
    document.addEventListener("click", onMouseClick);

    //All the qualifiers needed by shaders

    var uTheta = gl.getUniformLocation(shaderProgram, "uTheta");


    //Teach the computer (GPU) how to collect the positional values from ARRAY_BUFFER
    // for each vertex being processed

    var aPositon = gl.getAttribLocation(shaderProgram, "aPosition"); //put in CPU realm
    gl.vertexAttribPointer(
    aPositon,
    2, 
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0);
    gl.enableVertexAttribArray(aPositon);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(
        aColor, //a pos - acol
        3, //rgb 2 -> 3
        gl.FLOAT, 
        false, 
        5 * Float32Array.BYTES_PER_ELEMENT, //5 data, 2 value from index
        2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);
    

    function render(){
    // setTimeout(function(){
    gl.clearColor(1.0, 0.75, 0.79, 1.0);
                //red, Green, Blue, Alpha (transparancy)

    gl.clear(gl.COLOR_BUFFER_BIT);
    if(isAnimated){
        theta += 0.01;
        gl.uniform1f(uTheta, theta);
    }
   
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    // render();
    // }, 1000/30);
    
    // setInterval(render, 1000/60);

    //(mode, first, count);
    requestAnimationFrame(render);
}
// render();
requestAnimationFrame(render);
}