function matrixMult(m1, m2) {
	// Assume m1 and m2 are 4x4 matrixMult
	console.log(m2);
	var m3 = [];
	for (var i = 0; i < 4; i++) {
		for (var j = 0; j < 4; j++) {
			var currElement = 0;
			for (var k = 0; k < 4; k++) {
				currElement += m1[4 * i + k] * m2[4 * k + j];
			}
			m3.push(currElement);
		}
	}
	return m3;
}

function matrixMult2(m1, m2, r, n, c) {
	// Assume m1 is rxn matrix, m2 is nxc matrix
	var m3 = [];
	for (var i = 0; i < r; i++) {
		for (var j = 0; j < c; j++) {
			var currElement = 0;
			for (var k = 0; k < n; k++) {
				currElement += m1[n * i + k] * m2[c * k + j];
			}
			m3.push(currElement);
		}
	}
	return m3;
}

function cofactor(m, n, i, j) {
	// m is matrix nxn
	return determinant(minor(m, n, i, j), n - 1) * Math.pow(-1, i + j);
}

function minor(m, n, i, j) {
	// m is matrix nxn, row and column starts from zero
	var result = [];
	for (var row = 0; row < n; row++) {
		if (row != i) {
			for (var col = 0; col < n; col++) {
				if (col != j) {
					result.push(m[n * row + col]);
				}
			}
		}
	}
	return result;
}

function determinant(m, n) {
	// m is matrix nxn, row and column starts from zero
	if (n == 2) { // Base
		return (m[0] * m[3] - m[1] * m[2]);
	} else { // Recursion
		var result = 0;
		for (var k = 0; k < n; k++) {
			// Note: row and column starts from zero
			result += m[k] * cofactor(m, n, 0, k);
		}
		return result;
	}
}

function adjoint(m, n) {
	// m is matrix nxn
	var result = [];
	for (var row = 0; row < n; row++) {
		for (var col = 0; col < n; col++) {
			result.push(cofactor(m, n, col, row));
		}
	}
	return result;
}

function inverseMatrix(m, n) {
	var determinantOfM = determinant(m, n);
	return adjoint(m, n).map(el => el / determinantOfM);
}

var translationMatrix = (x, y) => {
	return [
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
};

var translationMatrix3D = (x, y, z) => {
	console.log(x, y, z);
	return [
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1
	];
};

var inverseTranslationMatrix = (x, y) => {
	return [
		1, 0, 0, -x,
		0, 1, 0, -y,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
};

var scaleMatrix = (x, y, z) => {
	return [
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	];
};

var xAxisRotationMatrix = angle => { // in radians
	return [
		1, 0, 0, 0,
		0, Math.cos(angle), -Math.sin(angle), 0,
		0, Math.sin(angle), Math.cos(angle), 0,
		0, 0, 0, 1
	];
};

var yAxisRotationMatrix = angle => { // in radians
	return [
		Math.cos(angle), 0, -Math.sin(angle), 0,
		0, 1, 0, 0,
		Math.sin(angle), 0, Math.cos(angle), 0,
		0, 0, 0, 1
	];
};

var zAxisRotationMatrix = angle => { // in radians
	return [
		Math.cos(angle), -Math.sin(angle), 0, 0,
		Math.sin(angle), Math.cos(angle), 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
};

var currentMatrix = translationMatrix(0, 0);

function initializeGLProgram(gl, vertexShaderCode, fragmentShaderCode) {
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderCode);
	gl.compileShader(vertexShader);
	
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderCode);
	gl.compileShader(fragmentShader);
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		alert(gl.getProgramInfoLog(program));
	}

	gl.useProgram(program);
	
	return {
		"program": program,
		"shader": {
			"vertex": vertexShader,
			"fragment": fragmentShader
		}
	};
}

class Balok {
	constructor(xPos, yPos, zPos, xScale, yScale, zScale) {
		const posXPlusHalfXScale = xPos + xScale / 2;
		const posYPlusHalfYScale = yPos + yScale / 2;
		const posZPlusHalfZScale = zPos + zScale / 2;
		const posXMinHalfXScale = xPos - xScale / 2;
		const posYMinHalfYScale = yPos - yScale / 2;
		const posZMinHalfZScale = zPos - zScale / 2;
		
		this.vertices = [
			posXPlusHalfXScale, posYPlusHalfYScale, posZPlusHalfZScale,
			posXMinHalfXScale, posYPlusHalfYScale, posZPlusHalfZScale,
			posXPlusHalfXScale, posYMinHalfYScale, posZPlusHalfZScale,
			posXMinHalfXScale, posYMinHalfYScale, posZPlusHalfZScale,
			posXPlusHalfXScale, posYPlusHalfYScale, posZMinHalfZScale,
			posXMinHalfXScale, posYPlusHalfYScale, posZMinHalfZScale,
			posXPlusHalfXScale, posYMinHalfYScale, posZMinHalfZScale,
			posXMinHalfXScale, posYMinHalfYScale, posZMinHalfZScale
		];
		
		this.texCoords = [
			1, 1,
			0, 1,
			1, 0,
			0, 0,
			0, 0,
			1, 0,
			0, 1,
			1, 1
		]
		
		this.indices = [
			0, 1, 3, 3, 2, 0, // Front
			0, 4, 5, 5, 1, 0, // Top
			0, 2, 6, 6, 4, 0, // Right (from viewer POV)
			1, 5, 7, 7, 3, 1, // Left
			2, 3, 7, 7, 6, 2, // Bottom
			4, 6, 7, 7, 5, 4  // Back
		];
		
		this.transformationMatrix = scaleMatrix(1, 1, 1);
		
		// Left Child Right Sibling
		this.firstChild = null;
		this.nextSibling = null;
	}
	
	addSibling(other) {
		if (this.nextSibling === null) {
			this.nextSibling = other;
		} else {
			this.nextSibling.addSibling(other);
		}
	}
	
	addChild(other) {
		if (this.firstChild === null) {
			this.firstChild = other;
		} else {
			this.firstChild.addSibling(other);
		}
	}
	
	getChilds() {
		if (this.firstChild === null) {
			return [];
		} else {
			return [this.firstChild].concat(this.firstChild.getSiblings());
		}
	}
	
	getSiblings() {
		if (this.nextSibling === null) {
			return [];
		} else {
			return [this.nextSibling].concat(this.nextSibling.getSiblings());
		}
	}
	
	rotateX(rad, posX, posY, posZ) {
		console.log(this.transformationMatrix);
		this.transformationMatrix = matrixMult(translationMatrix3D(-posX, -posY, -posZ), this.transformationMatrix);
		this.transformationMatrix = matrixMult(xAxisRotationMatrix(rad), this.transformationMatrix);
		this.transformationMatrix = matrixMult(translationMatrix3D(posX, posY, posZ), this.transformationMatrix);
		
		this.getChilds()
			.forEach(child => {
				console.log(child);
				child.rotateX(rad, posX, posY, posZ)
			});
	}
	
	rotateY(rad, posX, posY, posZ) {
		console.log(this.transformationMatrix);
		this.transformationMatrix = matrixMult(translationMatrix3D(-posX, -posY, -posZ), this.transformationMatrix);
		this.transformationMatrix = matrixMult(yAxisRotationMatrix(rad), this.transformationMatrix);
		this.transformationMatrix = matrixMult(translationMatrix3D(posX, posY, posZ), this.transformationMatrix);
		
		this.getChilds()
			.forEach(child => {
				console.log(child);
				rotateX(rad, posX, posY, posZ)
			});
	}
	
	rotateZ(rad, posX, posY, posZ) {
		console.log(this.transformationMatrix);
		this.transformationMatrix = matrixMult(translationMatrix3D(-posX, -posY, -posZ), this.transformationMatrix);
		this.transformationMatrix = matrixMult(zAxisRotationMatrix(rad), this.transformationMatrix);
		this.transformationMatrix = matrixMult(translationMatrix3D(posX, posY, posZ), this.transformationMatrix);
		
		this.getChilds()
			.forEach(child => {
				console.log(child);
				rotateX(rad, posX, posY, posZ)
			});
	}
	
	getActualVertices() {
		var actualVertices = [];
		var currentVertexCoordinate = [0, 0, 0];
		let axisNum = 0; 
		this.vertices.forEach(el => {
			currentVertexCoordinate[axisNum] = el;
			if (axisNum == 2) {
				let transformedCoordinate = matrixMult2(
					this.transformationMatrix,
					currentVertexCoordinate.concat([1]), 4, 4, 1
				);
				actualVertices = actualVertices.concat([
					transformedCoordinate[0],
					transformedCoordinate[1],
					transformedCoordinate[2]
				]);
				currentVertexCoordinate = [0, 0, 0];
			}
			axisNum = (axisNum + 1) % 3;
		});
		return actualVertices;
	}
	
	render(gl, vertexBuffer, indexBuffer, textureBuffer) {
		// console.log(this.getActualVertices());
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.getActualVertices()), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}

// Initialize system
const canvas = document.querySelector("#mycanvas");
const gl = canvas.getContext("webgl");

if (gl === null) {
	alert("Tidak dapat menginisialisasi WebGL .-.");
}

// Buat shader
var vertCode = `
	attribute vec3 coordinates;
	attribute vec2 a_texcoord;
	uniform mat4 transformationMatrix;
	varying float colorFactor;
	varying vec2 v_texcoord;
	void main() {
		// Z dikali negatif karena vektor Z di WebGL berlawanan
		vec4 transformedPosition = vec4(coordinates.xy, coordinates.z * -1.0, 1.0) * transformationMatrix;
		gl_Position = transformedPosition;
		colorFactor = min(max((1.0 - transformedPosition.z) / 2.0, 0.0), 1.0);
		v_texcoord = a_texcoord;
	}
`;
	
var fragCode = `
	precision mediump float;
	uniform vec3 userColor;
	uniform sampler2D u_texture;
	varying float colorFactor;
	varying vec2 v_texcoord;
	void main(void) {
		//gl_FragColor = vec4(userColor * colorFactor, 1.0); //texture2D(uSampler, fTexCoord);
		gl_FragColor = texture2D(u_texture, v_texcoord) * colorFactor;
	}
`;

var glObject = initializeGLProgram(gl, vertCode, fragCode);

var vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

var index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);

var texture_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);

var vertices = [];
var indices = [];
var textureCoordinates = [];
var numPoints = 0;


const lowerLeftLeg = new Balok(1, 1, 0, 1, 2, 1);
const lowerRightLeg = new Balok(-1, 1, 0, 1, 2, 1); // Lower right leg
const upperLeftLeg = new Balok(1, 4, 0, 1, 2, 1); // Upper left leg
const upperRightLeg = new Balok(-1, 4, 0, 1, 2, 1); // Upper right leg
const torso = new Balok(0, 8, 0, 3, 4, 3); // Torso
const lowerLeftArm = new Balok(3, 6, 0, 1, 2, 1); // Lower left arm
const lowerRightArm = new Balok(-3, 6, 0, 1, 2, 1); // Lower right arm
const upperLeftArm = new Balok(3, 9, 0, 1, 2, 1); // Upper left arm
const upperRightArm = new Balok(-3, 9, 0, 1, 2, 1); // Upper right arm
const neck = new Balok(0, 11.5, 0, 1, 1, 1); // Neck
const head = new Balok(0, 14.5, 0, 3, 3, 3); // Head


baloks = [
	// new Balok(0, -0.5, 0, 100, 1, 100), // Plane
	new Balok(1, 1, 0, 1, 2, 1), // Lower left leg (robot POV)
	new Balok(-1, 1, 0, 1, 2, 1), // Lower right leg
	new Balok(1, 4, 0, 1, 2, 1), // Upper left leg
	new Balok(-1, 4, 0, 1, 2, 1), // Upper right leg
	new Balok(0, 8, 0, 3, 4, 1), // Torso
	new Balok(3, 6, 0, 1, 2, 1), // Lower left arm
	new Balok(-3, 6, 0, 1, 2, 1), // Lower right arm
	new Balok(3, 9, 0, 1, 2, 1), // Upper left arm
	new Balok(-3, 9, 0, 1, 2, 1), // Upper right arm
	new Balok(0, 11.5, 0, 1, 1, 1), // Neck
	new Balok(0, 14.5, 0, 3, 3, 3) // Head
];

baloks[2].addChild(baloks[0]);
baloks[2].rotateX(Math.PI / 2, 1, 6.5, 0);



// Combine
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
var coord = gl.getAttribLocation(glObject.program, "coordinates");
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(coord);

var translationMatrixLoc = gl.getUniformLocation(glObject.program, "transformationMatrix");
gl.uniformMatrix4fv(translationMatrixLoc, false, new Float32Array(currentMatrix));

var colorLoc = gl.getUniformLocation(glObject.program, "userColor");
gl.uniform3f(colorLoc, 0.0, 0.0, 0.0);

/*
gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
var vTexCoord = gl.getAttribLocation(shaderProgram, "vTexCoord");
gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vTexCoord);
*/


gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);
var texcoordLocation = gl.getAttribLocation(glObject.program, "a_texcoord");
gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(texcoordLocation);

var textureLocation = gl.getUniformLocation(glObject.program, "u_texture");


// Pass data
/*
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

gl.bindBuffer(gl.ARRAY_BUFFER, texture_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);		

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
*/
// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);

// Create texture
var texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
 
// Fill the texture with a 1x1 blue pixel.
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
			  new Uint8Array([255, 255, 255, 255]));
 
// Asynchronously load an image
function loadTexture(url) {
	const imgPromise = new Promise(function imgPromise(resolve, reject) {
		const imgElement = new Image();
		
		imgElement.addEventListener("load", function imgOnLoad() {
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgElement);
			// gl.generateMipmap(gl.TEXTURE_2D);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			resolve(this);
		});
		
		imgElement.addEventListener("error", function imgOnError() {
			reject();
		});

		imgElement.src = url;
	});
	
	return imgPromise;
}

loadTexture("hole.jpg").then(
	function fulfilled(img) {
		console.log("Texture loaded");
		render();
	},
	
	function rejected() {
		console.log("Texture not found");
	}
);



/*
var myImg = document.createElement("img");
myImg.addEventListener('load', function() {
  // Load the texture
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, myImg);
  // gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  render();
});
myImg.addEventListener('error', event => {
	console.log(event.message);
	alert("Error load the texture. .-.");
});
// myImg.src = "https://images.unsplash.com/photo-1614535683569-129faaa108f7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80";
// myImg.src = "hole.jpg";
myImg.crossOrigin = "";
*/

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	baloks.forEach(balok => {
		balok.render(gl, vertex_buffer, index_buffer, texture_buffer);
	});
}

// Update
currentMatrix = matrixMult(scaleMatrix(.05, .05, .05), currentMatrix);
currentMatrix = matrixMult(translationMatrix(0, -0.5), currentMatrix);
gl.uniform3f(colorLoc, 1.0, 1.0, 1.0);
gl.uniform1i(textureLocation, 0.0);
gl.uniformMatrix4fv(translationMatrixLoc, false, new Float32Array(currentMatrix));

var yDegree = 0;
var handDegree = 0;

var rotateInterval;
var rotating = false;

function startRotating() {
	rotating = true;
	rotateInterval = setInterval(() => {
		currentMatrix = matrixMult(yAxisRotationMatrix(yDegree), scaleMatrix(.05, .05, .05));
		currentMatrix = matrixMult(translationMatrix(0, -0.5), currentMatrix);
		gl.uniformMatrix4fv(translationMatrixLoc, false, new Float32Array(currentMatrix));
		render();
		yDegree += 0.05;
	}, 40);
}

function stopRotating() {
	clearInterval(rotateInterval);
	rotating = false;
}

function switchRotating() {
	if (rotating) {
		stopRotating();
	} else {
		startRotating();
	}
}



// Create stop animation