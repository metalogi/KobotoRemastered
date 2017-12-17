
var open : boolean;

var opening : boolean =false;
var closing : boolean =false;

var openPosition : Vector3;

var door : Transform;

var openSpeed : float =4.0;
var closeSpeed : float =2.0;

var switchSound : AudioSource;
var doorSound : AudioSource;

var mat0 : Material;
var mat1 : Material;

function Awake()
{
	if (mat0) GetComponent.<Renderer>().material = mat0;
	switchSound = GetComponent(AudioSource);
	doorSound = door.GetComponent(AudioSource);
}

function OnTriggerEnter (col:Collider) {
	var junc:Juncore = col.GetComponent(Juncore);
	
	if (junc&&!open)  OpenDoor();
	
}

function OnTriggerStay (col:Collider) {
	var junc:Juncore = col.GetComponent(Juncore);
	
	if (junc&&!open)  OpenDoor();
	
}

function OnTriggerExit (col:Collider) {
	var junc:Juncore = col.GetComponent(Juncore);
	
	if (junc&&open) CloseDoor();
	
}

function OpenDoor()
{
	if (switchSound) switchSound.Play();
	//if (doorSound) doorSound.Play();
	if (mat1) GetComponent.<Renderer>().material = mat1;
	open=true;
	opening =true;
	closing = false;
	while (opening)
	{
		
		//print ((door.localPosition - openPosition).magnitude);
		door.localPosition = Vector3.Lerp(door.localPosition, openPosition, openSpeed*Time.deltaTime);
		if ((door.localPosition - openPosition).magnitude < 0.05) opening =false;
		yield;
	}
	//if (doorSound) doorSound.Stop();
}

function CloseDoor()
{
	if (switchSound) switchSound.Play();
	//if (doorSound) doorSound.Play();
	if (mat0) GetComponent.<Renderer>().material = mat0;
	open=false;
	opening =false;
	closing = true;
	while (closing)
	{	
		//print (door.localPosition.magnitude);
		door.localPosition = Vector3.Lerp(door.localPosition, Vector3.zero, closeSpeed*Time.deltaTime);
		if (door.localPosition.magnitude < 0.05) closing = false;
		yield;
	}
	//if (doorSound) doorSound.Stop();
}