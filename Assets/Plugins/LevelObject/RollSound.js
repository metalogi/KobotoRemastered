var roll : AudioSource;
//var thud : AudioSource;
var ridge: Rigidbody;
var airborne:boolean =true;
function Awake()
{
	//ridge = GetComponent(Rigidbody);
	
}

function Update () {
	if (ridge.velocity.magnitude>0)
	{
		if (roll.isPlaying) 
		 roll.volume=Mathf.Lerp(0, 1, Mathf.Abs(ridge.velocity.magnitude)/100);
	}
}

function OnTriggerEnter()
{
	airborne = false;
	if (!roll.isPlaying)  roll.Play();
}

function OnTriggerStay()
{
	airborne = false;
}

function OnTriggerExit()
{
	airborne = true;
	
	StopSound(); 
}

function StopSound()
{
	yield WaitForSeconds(0.5);
	if (airborne) roll.Stop();
}