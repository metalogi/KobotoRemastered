
var startRot: float;

var targetAngle : float;

function Awake()
{
	GetComponent.<Rigidbody>().MoveRotation(Quaternion.Euler(0,90,targetAngle));
	startRot =targetAngle;
	 
}

function Activate(v:boolean)
{
	targetAngle *= -1;
	var inPlace : boolean =false;
	var currentAngle : float;
	var newAngle : float;
	while (!inPlace)
	{
		currentAngle = transform.eulerAngles.z;
		newAngle = Mathf.LerpAngle(currentAngle, targetAngle, 10*Time.deltaTime);
		GetComponent.<Rigidbody>().MoveRotation(Quaternion.Euler(0,90,newAngle));
		if (Mathf.Abs(newAngle-targetAngle)<1) inPlace =true;
		yield;
		
	}
	GetComponent.<Rigidbody>().MoveRotation(Quaternion.Euler(0,90,targetAngle));
	
}

function Reset(v:boolean)
{
	targetAngle =startRot;
	GetComponent.<Rigidbody>().MoveRotation(Quaternion.Euler(0,90,targetAngle));

}