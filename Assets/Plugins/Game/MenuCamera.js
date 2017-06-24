
private var gen : GenericFunctions;
private var aud:AudioSource;
var worldNumber : String;

function Awake()
{
	gen = GetComponent(GenericFunctions);
	aud=GetComponent(AudioSource);
	aud.volume=PlayerPrefs.GetFloat("MusicVolume",0.5);
	
	//positionTarget.z =PlayerPrefs.GetFloat((worldNumber+"MenuCamZ"), -32);
	//positionTarget.y = PlayerPrefs.GetFloat((worldNumber+"MenuCamY"),-4);
	positionTarget.x =20;
	transform.position.z=positionTarget.z;
	transform.position.y=positionTarget.y;
	
	//print(positionTarget.z);
}

var scrollArea : Rect = Rect(0,0,0,0);
var scrollSpeed : float = 450;
var flingSpeed : float = 3500;

var zoomMin=3;
var zoomMax=10;
var zoomSpeed=10;

var snapSpeed: float =4;

// a point in space the main camera retreats to when the level is played
private var inPosition : boolean;
private var iPhoneDragSpeed:float =0.04;
var positionTarget:Vector3;
// main camera update
function Update () 
{	
		//see if user is dragging finger on screenand move camera accordingly
		if (gen.IsTouching())
		{
		var touchInfo:Touch = gen.GetTouchInfo(0);
		if ((touchInfo.phase == TouchPhase.Moved)&&(Input.touchCount==1))
			{	
				positionTarget.z -= iPhoneDragSpeed*touchInfo.deltaPosition.x*Time.deltaTime*scrollSpeed/4;
				positionTarget.y -= iPhoneDragSpeed*touchInfo.deltaPosition.y*Time.deltaTime*scrollSpeed/4;
				
			}
			
			if (Input.touchCount==2)
			{
				var touchInfo2:Touch =gen.GetTouchInfo(1);
				if ((touchInfo.phase ==TouchPhase.Moved))
				{	var spread:float;
					var separation:float =(touchInfo.position -touchInfo2.position).magnitude;
					var newSep:float = ((touchInfo.position +touchInfo.deltaPosition)-(touchInfo2.position +touchInfo2.deltaPosition)).magnitude;
					spread =newSep-separation;
					//print (transform.position.x);
					
					positionTarget.x -= iPhoneDragSpeed*spread*Time.deltaTime*scrollSpeed;
				}
			}
			
			
		}
		
		transform.position = Vector3.Lerp(transform.position, positionTarget, snapSpeed*Time.deltaTime);
		
		
			
				// cap camera position within map area
	if( transform.position.z < scrollArea.xMin )
		{transform.position.z = scrollArea.xMin;positionTarget.z= scrollArea.xMin;}
	if( transform.position.z > scrollArea.xMin+scrollArea.width )
		{transform.position.z = scrollArea.xMin+scrollArea.width;
		positionTarget.z= scrollArea.xMin+scrollArea.width;}

	if( transform.position.y < scrollArea.yMin )
		{transform.position.y = scrollArea.yMin; positionTarget.y= scrollArea.yMin;}
	if( transform.position.y > scrollArea.yMin+scrollArea.height )
		{transform.position.y = scrollArea.yMin+scrollArea.height;
		positionTarget.y = scrollArea.yMin+scrollArea.height;
		}
		
		if (positionTarget.x>40) positionTarget.x =40;
		if (positionTarget.x<20) positionTarget.x =20;
/*
	if( transform.position.x < zoomMin )
		transform.position.x = zoomMin;
	if( transform.position.x > zoomMax )
		transform.position.x = zoomMax;
		*/
		//transform.position.x =20;
		
		PlayerPrefs.SetFloat((worldNumber+"MenuCamY"), transform.position.y );
		PlayerPrefs.SetFloat((worldNumber+"MenuCamZ"), transform.position.z );
			
		
}

function SetFocus(focus:Vector3)
{
	positionTarget=focus;
	positionTarget.x =20;
	positionTarget.y+=7;
}