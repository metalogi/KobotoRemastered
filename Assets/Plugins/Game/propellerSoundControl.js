
var propSpeed: float;

var single : AudioSource;
var engine : AudioSource;

var on:boolean;
var waitTime:float;

var rampingUp:boolean =false;

function StartSound()
{
	print ("Starting propeller");
	on=true;
	engine.volume=0;
	engine.pitch=0.8;
	engine.Play();
	RampUp();
	

	//BladeSwoop();	
	
}

function StopSound()
{
	engine.Stop();
	on= false;
	propSpeed=0;
}

function BladeSwoop()
{
		while (on && propSpeed)
	{
		single.Play();
		 waitTime = Mathf.Lerp(5, 0.01, propSpeed);
		yield WaitForSeconds(waitTime);
		
	}
	
}

function RampUp()
{
	rampingUp=true;
	while (engine.pitch < 1.7)
	{
		engine.volume += Time.deltaTime*8;
		 engine.pitch += Time.deltaTime*5;
		yield;
	}
	rampingUp=false;
}
