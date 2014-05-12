var charImgLoaded = false;
var characterImg = new Image();
var imgName = "";

var resZoom = 2;

var canvasWidth = 640/resZoom;
var canvasHeight = 480/resZoom;

var centerPos = [canvasWidth * 0.5, canvasHeight * 0.5];
var charPos = [0,0];

function HitBox(x,y,w,h,t){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.t = t;
}

var hitBoxes = [];

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

function changeZoom(){
	var tempZoom =  parseInt($("#zoom").val());
	if(tempZoom > 0){
		resZoom = tempZoom;
		canvasWidth = 640/resZoom;
		canvasHeight = 480/resZoom;

		centerPos = [canvasWidth * 0.5, canvasHeight * 0.5];
	}
}

function moveChar(){
	charPos[0] = parseInt($("#charx").val());
	charPos[1] = parseInt($("#chary").val());
}

function updateHitboxdelete(){
	var options = "";

	for(var i = 0; i < hitBoxes.length; i++){
		options += "<option>" + i + " || " + hitBoxes[i].x + " | " + hitBoxes[i].y + " | "  + hitBoxes[i].w + " | "  + hitBoxes[i].h + " | "  + hitBoxes[i].t + "</option>";  
	}

	if(hitBoxes.length == 0) options += "<option>none</option>";

	$('#hitboxdelete').html(options);
}

function addHitbox(){
	console.log("addhitbox");
	var tempHitbox = new HitBox(0,0,0,0,0);
	tempHitbox.x = parseInt($("#hitx").val());
	tempHitbox.y = parseInt($("#hity").val());
	tempHitbox.w = parseInt($("#hitw").val());
	tempHitbox.h = parseInt($("#hith").val());
	tempHitbox.t = parseInt($("#hitt").val());

	if(tempHitbox.t >= 0 && tempHitbox.w > 0 && tempHitbox.h > 0){
		console.log("push");
		hitBoxes.push(tempHitbox);
	}

	updateHitboxdelete();
}

function removeHitbox(){
	var deleteNum =	$('#hitboxdelete').find(":selected").val();
	console.log(deleteNum);
	var tempHitboxes = [];
	for(var i = 0; i < hitBoxes.length; i++){
		var boxStr = i + " || " + hitBoxes[i].x + " | " + hitBoxes[i].y + " | "  + hitBoxes[i].w + " | "  + hitBoxes[i].h + " | "  + hitBoxes[i].t;
		if(boxStr != deleteNum) tempHitboxes.push(hitBoxes[i]);
	}
	hitBoxes = tempHitboxes;
	updateHitboxdelete();
}

function outputToXML(){
	if(charImgLoaded){
		console.log("xml printing");
		var xml = "\<frame\>\n";
			xml += "\t\<img\>" + imgName + "\<\/img\>\n";
			xml += "\t\<x\>" + charPos[0]  + "\<\/x\>\n";
			xml += "\t\<y\>" + charPos[1]  + "\<\/y\>\n";
			xml += "\t\<numhitboxes\>" + hitBoxes.length  + "\<\/numhitboxes\>\n";
			xml += "\t\<hitboxes\>\n";			
			for(var i = 0; i < hitBoxes.length; i++){
				xml += "\t\t\<hitbox\>\n";
					xml += "\t\t\t\<x\>" + hitBoxes[i].x  + "\<\/x\>\n";
					xml += "\t\t\t\<y\>" + hitBoxes[i].y  + "\<\/y\>\n";
					xml += "\t\t\t\<w\>" + hitBoxes[i].w  + "\<\/w\>\n";
					xml += "\t\t\t\<h\>" + hitBoxes[i].h  + "\<\/h\>\n";
					xml += "\t\t\t\<t\>" + hitBoxes[i].t  + "\<\/t\>\n";
				xml += "\t\t\<\/hitbox\>\n";				
			}
			xml += "\t\<\/hitboxes\>\n";
		xml += "\<\/frame\>";
		$('#xmloutput').text(xml);
	}
}

function displayImg(files) {
	var selected_file = files[0];
	if(selected_file !== 'undefined'){
		console.log("name: " + selected_file.name);
		console.log("type: " + selected_file.type);
		console.log("size: " + selected_file.size);
		if(selected_file.type == "image/png"){
			if(selected_file.size <= 200000){

				console.log("passed tests");				

				var reader = new FileReader();

			      	// Closure to capture the file information.
			     	reader.onload = (function(file) {			
						characterImg.src = file.target.result;
						charImgLoaded = true;
							
						imgName = selected_file.name;							
						
						console.log("uploaded");
				});

				reader.readAsDataURL(selected_file);				
			}

			else{
				console.log("<strong>File too big. Must be smaller then 200000 bytes.</strong>");
			}
		}

		else{
			console.log("<strong>File must be a .png.</strong>");
		}
	}
}



function animloop() {
    	requestAnimFrame(animloop);
	update();
   	draw();
}

function init() {

	update();
    	animloop();
}

function draw(){
	var ctx = $('#canvas')[0].getContext("2d"); //get context of canvas
	ctx.mozImageSmoothingEnabled = false;
	ctx.setTransform(resZoom, 0, 0, resZoom, 0, 0);

	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,640, 480);
	if(charImgLoaded){
		ctx.drawImage(characterImg, (centerPos[0] + charPos[0]), (centerPos[1] + charPos[1]));
	}

	ctx.globalAlpha = 0.5;
	for(var i = 0; i < hitBoxes.length; i++){
		if(hitBoxes[i].t == 0) ctx.fillStyle = "#00ffff";
		ctx.fillRect(centerPos[0] + hitBoxes[i].x,centerPos[1] + hitBoxes[i].y,hitBoxes[i].w, hitBoxes[i].h);
	}
	ctx.globalAlpha = 1;

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	for(var i = 0; i < hitBoxes.length; i++){
		if(hitBoxes[i].t == 0) ctx.fillStyle = "#ffffff";
		ctx.fillText(i, (centerPos[0] + hitBoxes[i].x) * resZoom, ((centerPos[1] + hitBoxes[i].y) * resZoom) + 7);
	}

	
	ctx.fillStyle = "#ff0000";
	ctx.fillRect(0, centerPos[1] * resZoom, canvasWidth * resZoom, 1);
	ctx.fillRect(centerPos[0] * resZoom, 0,  1, canvasHeight * resZoom);
}

function update(){

}

$(document).ready(function(){
	init();
});
