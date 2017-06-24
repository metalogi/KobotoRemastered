private var orig : Vector3;
var startPercent = 0;
private var percent = 0.0;


function Awake()
{
	orig = transform.position;
	percent = startPercent;
}

var totalTime = 1.0;
var totalDistance = Vector3(0,0,300);
function Update () 
{
	percent += Time.deltaTime / totalTime;
	if( percent > 1.0 ) percent -= 1.0;
	transform.position = orig + totalDistance*percent;
	if( GetComponent(Rigidbody) ) GetComponent.<Rigidbody>().velocity = totalDistance / totalTime;
}