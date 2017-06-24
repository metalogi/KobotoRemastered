

var targetHeight = 0.0;
var riseTime = 1.0;
var descendDelay = 0.0;

private var on = false;
private var activeTime = 0.0;
private var y = 0.0;
var moveDirection = Vector3(0,1,0);
private var naturalPosition : Vector3;

var cutAway:boolean=true;
var cutAwayReset:boolean;
var cutAwayTime:float=1.0;
var startDelay:float= 0.5;
private var cam:CameraManager;

function Awake ()
{
	naturalPosition = transform.localPosition;
	cam=GetComponent.<Camera>().main.GetComponent(CameraManager);
	cutAwayReset=cutAway;
}

function Reset(v:boolean)
{
	y=0.0;
	on=false;
	activeTime=0.0;
	transform.localPosition = naturalPosition;
	cutAway=cutAwayReset;
}

function TurnOn()
{
	yield new WaitForSeconds(startDelay);
	on = true;
	activeTime = 0.0;
}

function Update () 
{
	if( on )
	{
		activeTime += Time.deltaTime;
		// final drop
		if( descendDelay > 0 && activeTime > descendDelay )
		{
			if( y >= 0 )
			{
				y -= Time.deltaTime * targetHeight / riseTime;
				if( y < 0 ) { y = 0; on = false; activeTime = 0.0; }
			}
			else
			{
				y += Time.deltaTime * -targetHeight / riseTime;
				if( y > 0 ) { y = 0; on = false; activeTime = 0.0; }
			}
		}
		// initial rise
		else
		{
			if( targetHeight > 0 && y < targetHeight )
			{
				y += Time.deltaTime * targetHeight / riseTime;
				if( y > targetHeight ) y = targetHeight;
			}
			if( targetHeight < 0 && y > targetHeight )
			{
				y -= Time.deltaTime * -targetHeight / riseTime;
				if( y < targetHeight ) y = targetHeight;
			}
		}
		transform.localPosition = naturalPosition + moveDirection*y;
	}


}