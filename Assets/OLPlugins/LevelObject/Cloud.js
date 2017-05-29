private var cam:CameraManager;
private var menuCam:MenuCamera;
private var cameraLeniance:float = 120;
private var cloudSpeed:float;
private var originZ;

var flipDirection : boolean =false;

private var camX:float;
private var camWidth:float;

private var minSpeed:float = 20.0;
private var speedRange:float = 40.0;

private var paused:boolean=false;

function Awake ()
{
	cameraLeniance -= transform.position.x*2;
	originZ = transform.position.z;
	cloudSpeed = minSpeed + Random.value * speedRange;
	var FoundCam:Camera =FindObjectOfType(Camera);
	cam = FoundCam.GetComponent(CameraManager);
	menuCam = FoundCam.GetComponent(MenuCamera);
	if(cam)
	{
		camX =cam.scrollArea.x;
		camWidth =cam.scrollArea.width;
	}	
	else
	{
		camX =menuCam.scrollArea.x;
		camWidth =menuCam.scrollArea.width;
	}
	
	if (flipDirection) cloudSpeed *=-1;
	
	transform.eulerAngles = Vector3.zero;
	transform.localScale.z = transform.localScale.x;
}

function Update ()
{
	if(!paused)
	{
	transform.position.z += cloudSpeed * Time.deltaTime;
	if( transform.position.z > camX + camWidth + cameraLeniance )
	{
		transform.position.z -= (camWidth + cameraLeniance*2);
	}
	}
}

function Reset ()
{
	transform.position.z = originZ;
}

function GeneralPause(val:boolean)
{
	paused=val;
}