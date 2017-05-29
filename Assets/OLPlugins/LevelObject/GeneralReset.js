var resetTransform = true;
var secondaryScript : String;

private var originPos : Vector3;
private var originRot : Quaternion;
private var sec;

function Awake()
{
	originPos = transform.position;
	originRot = transform.rotation;
	sec =GetComponent(secondaryScript);
}

function TurnOn()
{	var ridge:Rigidbody = GetComponent(Rigidbody);
	var junc:Juncore=GetComponent(Juncore);
	//if( junc ) ridge.isKinematic=false;
	//if( ridge ) ridge.WakeUp();
	/* this bit won't work with static typing so I've commented it out for the moment -Ed
	
	
	
	if( sec ) 
	{
		sec.enabled=true;
	}
	*/
	
		var el:Elevator =GetComponent(Elevator);
	if (el) el.enabled=true;
	var fan:FanTastic =GetComponent(FanTastic);
	if (fan) fan.enabled=true;
	var JetStream:Jetstream =GetComponent(Jetstream);
	if (JetStream) JetStream.enabled=true;
	var Shatter:ShatterBlast =GetComponent(ShatterBlast);
	if (Shatter) Shatter.enabled=true;
	var sButton:Button =GetComponent(Button);
	if (sButton) sButton.enabled=true;
	var swing:SimpleSwingivator =GetComponent(SimpleSwingivator);
	if (swing) swing.enabled=true;
	var windmill:Windmill =GetComponent(Windmill);
	if (windmill) windmill.enabled=true;
	
}

function TurnOff()
{
	var ridge:Rigidbody = GetComponent(Rigidbody);
	var junc:Juncore=GetComponent(Juncore);
	//if( junc ) ridge.isKinematic=true;
		/* this bit won't work with static typing so I've commented it out for the moment -Ed
	if( GetComponent(secondaryScript) ) 
	{
		GetComponent(secondaryScript).enabled=false;
	}
	*/
		var el:Elevator =GetComponent(Elevator);
	if (el) el.enabled=false;
	var fan:FanTastic =GetComponent(FanTastic);
	if (fan) fan.enabled=false;
	var JetStream:Jetstream =GetComponent(Jetstream);
	if (JetStream) JetStream.enabled=false;
	var Shatter:ShatterBlast =GetComponent(ShatterBlast);
	if (Shatter) Shatter.enabled=false;
	var sButton:Button =GetComponent(Button);
	if (sButton) sButton.enabled=false;
	var swing:SimpleSwingivator =GetComponent(SimpleSwingivator);
	if (swing) swing.enabled=false;
	var windmill:Windmill =GetComponent(Windmill);
	if (windmill) windmill.enabled=false;
}

function ResetState()
{
//	if( GetComponent(Animation) )
//		{GetComponent.<Animation>().Stop(); if (GetComponent.<Animation>().clip) <Animation>().clip.SampleAnimation(GetComponent.gameObject, 0);}
	
	

	if( resetTransform )
	{
		transform.position = originPos;
		transform.rotation = originRot;
	}
	var ridge:Rigidbody = GetComponent(Rigidbody);
	if (ridge && !ridge.isKinematic) 
	{
		ridge.velocity = Vector3.zero;
		ridge.angularVelocity = Vector3.zero;
	}

	/* this bit won't work with static typing so I've commented it out for the moment -Ed
	if( GetComponent(secondaryScript) ) 
	{
		GetComponent(secondaryScript).ResetState();
	}
	*/
	SendMessage ("Reset",true, SendMessageOptions.DontRequireReceiver);
	/*
	// replace with this- messy :(
	var el:Elevator =GetComponent(Elevator);
	if (el) el.ResetState();
	var fan:FanTastic =GetComponent(FanTastic);
	if (fan) fan.ResetState();
	var JetStream:Jetstream =GetComponent(Jetstream);
	if (JetStream) JetStream.ResetState();
	var Shatter:ShatterBlast =GetComponent(ShatterBlast);
	if (Shatter) Shatter.ResetState();
	var sButton:Button =GetComponent(Button);
	if (sButton) sButton.ResetState();
	var swing:SimpleSwingivator =GetComponent(SimpleSwingivator);
	if (swing) swing.ResetState();
	var windmill:Windmill =GetComponent(Windmill);
	if (windmill) windmill.ResetState();
	
	var floaty:Floaty =GetComponent(Floaty);
	if (floaty) floaty.ResetState();
	var cat:caterpillerZeppelin=GetComponent(caterpillerZeppelin);
	if (cat) cat.ResetState();
	var follow:SplineFollow =GetComponent(SplineFollow);
	if (follow) follow.ResetState();
	var oceanFloat:OceanFloat =GetComponent(OceanFloat);
	if (oceanFloat) oceanFloat.ResetState();
	*/
	
	

	
//	if( GetComponent(Animation) )
//		animation.Reset();
}