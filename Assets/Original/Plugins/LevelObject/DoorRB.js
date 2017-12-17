
var open : boolean;

var opening : boolean =false;
var closing : boolean =false;

var openPosition : Vector3;
var openPositionWS : Vector3;
var door : Transform;

var openSpeed : float =4.0;
var closeSpeed : float =2.0;
var RB : Rigidbody;
var closePositionWS : Vector3;
var doorWSPos :Vector3;

var paused : boolean = false;

function Awake()
{
	RB= door.GetComponent(Rigidbody);
	closePositionWS  = RB.position;
	openPositionWS =closePositionWS + openPosition;
	doorWSPos =closePositionWS;
}

function GeneralPause(v:boolean)
{
	paused =v;
	
}

function Reset(v:boolean)
{
	doorWSPos =closePositionWS;
}

function OnTriggerEnter (col:Collider) {
	var junc:Juncore = col.GetComponent(Juncore);
	
	if (junc&&!open)  OpenDoor();
	
}

function OnTriggerStay (col:Collider) {
	var junc:Juncore = col.GetComponent(Juncore);
	
	if (junc&&!open&!opening)  OpenDoor();
	
}

function OnTriggerExit (col:Collider) {
	var junc:Juncore = col.GetComponent(Juncore);
	
	if (junc&&open) CloseDoor();
	
}

function FixedUpdate()
{
	//RB.velocity = Vector3.zero;
	//print ("adding force: " +(doorWSPos - RB.position) * 4000 *Time.fixedDeltaTime);
	RB.AddForce((doorWSPos - RB.position) * 4000 *Time.fixedDeltaTime);
	//RB.MovePosition(doorWSPos);
}

function OpenDoor()
{
	open=true;
	opening =true;
	closing = false;
	
	while (opening)
	{
		print ("current: " + RB.position +"target: " + openPositionWS+ "t: " + openSpeed*Time.deltaTime);
		if (!paused) doorWSPos = openPositionWS;
		//if (!paused) doorWSPos =Vector3.Lerp(doorWSPos, openPositionWS, openSpeed*Time.deltaTime);
		//door.localPosition = Vector3.Lerp(door.localPosition, openPosition, openSpeed*Time.deltaTime);
		if ((door.position - openPositionWS).magnitude < 0.05) opening =false;
		yield;
	}
}

function CloseDoor()
{
	open=false;
	opening =false;
	closing = true;
	while (closing)
	{
		if (!paused) doorWSPos = closePositionWS;
		//if (!paused)doorWSPos = Vector3.Lerp(doorWSPos, closePositionWS, closeSpeed*Time.deltaTime);
		//print (door.localPosition.magnitude);
		//door.localPosition = Vector3.Lerp(door.localPosition, Vector3.zero, closeSpeed*Time.deltaTime);
		if (door.localPosition.magnitude < 0.05) closing = false;
		yield;
	}
}