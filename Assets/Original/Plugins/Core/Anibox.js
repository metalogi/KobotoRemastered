// the faceimation (face animation) class
// stores information on how the creature's faces animate
// (blinking, etc)
class FaceimationDef
{
	var uvAnimationTileX = 24; //Here you can place the number of columns of your sheet.
    	                       //The above sheet has 24

	var uvAnimationTileY = 1; //Here you can place the number of rows of your sheet.
        	                  //The above sheet has 1
	var framesPerSecond = 10.0; // how fast the animation plays

	var materialId = 0; // which material should be animated
	var scaleSize = true; // whether the uv coordinates are scaled to match the tilesSize or not

	var bounceIndex = false; // when true, the animation will run: 1 2 3 4 3 2, instead of 1 2 3 4
	var idleTime = 0.0; // how long the face pauses between animations
	var offsetTime:float=0;

	var timeIndex = 0.0; // an offset for how far into the animation timer the face starts
}
var faceimation : FaceimationDef;

// this function updates the facial animation
function UpdateOld()
{
	if( faceimation.materialId != -1 ) // only if there is a material specified to animate
	{
		faceimation.timeIndex += Time.deltaTime*faceimation.framesPerSecond;
		var animTime : int = faceimation.timeIndex - (faceimation.idleTime*faceimation.framesPerSecond);
		var index : int = 0;
		var fCount : int = faceimation.uvAnimationTileX * faceimation.uvAnimationTileY;
	
	    // if we are in the active part of the animation
		if( animTime > 0 )
		{
			if( faceimation.bounceIndex )
			{
				index = animTime;
				if( index >= fCount )
				{
					index = (fCount-1) - ( index - fCount );
					if( index <= 0 )
					{
					index = 0;
						faceimation.timeIndex = 0;
					}
				}
			}
			else
			{
				index = animTime;
				if( index >= fCount )
				{
					index = 0;
					faceimation.timeIndex = 0;
				}
			}
		}
 
    	// grab the tileSize relative to the texture
    	var size = Vector2 (1.0 / faceimation.uvAnimationTileX, 1.0 / faceimation.uvAnimationTileY);
   
    	// split into horizontal and vertical index
    	var uIndex = index % faceimation.uvAnimationTileX;
    	var vIndex = index / faceimation.uvAnimationTileX;

    	// build offset
    	// v coordinate is the bottom of the image in opengl so we need to invert.
   		var offset = Vector2 (uIndex * size.x, 1.0 - size.y - vIndex * size.y);
   
   		// update the material texture offsets
    	GetComponent.<Renderer>().materials[faceimation.materialId].SetTextureOffset ("_MainTex", offset);
	    GetComponent.<Renderer>().materials[faceimation.materialId].SetTextureScale ("_MainTex", faceimation.scaleSize ? size : Vector2(1.0, 1.0 ));
	}
}

// these function activate and deactivate the critter's walk animation
var animationIsOn = false;
function GoMe()
{
	if( GetComponent.<Animation>() && !animationIsOn )
	{
		GetComponent.<Animation>().Play();
		animationIsOn = true;
	}
}
function StopMe()
{	print ("Stoppin");
	if( GetComponent.<Animation>() && animationIsOn )
	{
		GetComponent.<Animation>().Stop();
		animationIsOn = false;
	}
}

function Start()
{
	nFrames =faceimation.uvAnimationTileX*faceimation.uvAnimationTileY;
	animTime =nFrames/faceimation.framesPerSecond;
	Tsize = Vector2(1.0 / faceimation.uvAnimationTileX, 1.0 / faceimation.uvAnimationTileY);
	TOffset = Vector2.zero;
	if( faceimation.materialId != -1 )
	{
	GetComponent.<Renderer>().materials[faceimation.materialId].SetTextureOffset ("_MainTex", TOffset);
	GetComponent.<Renderer>().materials[faceimation.materialId].SetTextureScale ("_MainTex", faceimation.scaleSize ? Tsize : Vector2(1.0, 1.0 ));
	}
	yield WaitForSeconds(faceimation.offsetTime);
	restart =true;
}
function Update()
{
	if (restart) Facemation();
}
var restart : boolean;
var timer:float;
var nFrames:int;
var animTime:float;
var TOffset:Vector2;
var Tsize :Vector2;
var ui:int ;
var vi:int ;
var ind:int;
function Facemation()
{
	restart=false;
	yield WaitForSeconds(faceimation.idleTime);
	
	timer=0;
	while (timer<animTime)
	{
		ind =timer*faceimation.framesPerSecond;
		// split into horizontal and vertical index
    	ui = ind % faceimation.uvAnimationTileX;
    	vi = ind / faceimation.uvAnimationTileX;
    	TOffset = Vector2 (ui * Tsize.x, 1.0 - Tsize.y - vi * Tsize.y);
    	if( faceimation.materialId != -1 )GetComponent.<Renderer>().materials[faceimation.materialId].SetTextureOffset ("_MainTex", TOffset);
    	
    	timer += Time.deltaTime;
    	yield;
	}
	ind = 0; 
	TOffset = Vector2.zero;
    if( faceimation.materialId != -1 )GetComponent.<Renderer>().materials[faceimation.materialId].SetTextureOffset ("_MainTex", TOffset);
	restart=true;
	
}

function Celebrate()
{
	//print ("celebrate");
	animationIsOn = true;
	if (GetComponent.<Animation>()) GetComponent.<Animation>().Play();
}