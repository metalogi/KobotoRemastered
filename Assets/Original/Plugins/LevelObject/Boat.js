var on:boolean;
private var paused:boolean;
var wake:ParticleEmitter;

var maxSpeed:float;
var accel:float;

var speeed:float;
var waterAngle:float;

var oceanFloat: OceanFloat;

function Awake()
{
	oceanFloat=GetComponent(OceanFloat);
}
function Activate(onoff:boolean)
{
	on=onoff;
	wake.emit=on;
		
	if (on)
	{
		oceanFloat.SetTargetRot(waterAngle,true,20);
		//yield WaitForSeconds(0.3);
		oceanFloat.SetForward(100*accel);
		
	}
	
	else
	{
		oceanFloat.SetForward(0);
		oceanFloat.SetTargetRot(0,false,5);
	}
		

	
}