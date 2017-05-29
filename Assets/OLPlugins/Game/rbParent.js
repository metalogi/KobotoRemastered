var on:boolean;
var parentObj:Transform;
var positionOffset:Vector3;
var autoOffset:boolean=false;
var late :boolean =false;
private var localPos : Vector3;

function Awake()
{
	if (autoOffset)
	{
		localPos = parentObj.InverseTransformPoint(transform.position);
	}
}
function FixedUpdate () {
	if (on && !late) 
	{
		//print (parentObj.position);
		//transform.position = parentObj.position;
		if (autoOffset) GetComponent.<Rigidbody>().MovePosition(parentObj.TransformPoint(localPos));
		else GetComponent.<Rigidbody>().MovePosition(parentObj.position + positionOffset);
		GetComponent.<Rigidbody>().MoveRotation(parentObj.rotation);
		//transform.localScale=parentObj.lossyScale;
	}
	
}

function LateUpdate(){
		if (on && late) 
	{
		//print (parentObj.position);
		//transform.position = parentObj.position;
		if (autoOffset) GetComponent.<Rigidbody>().MovePosition(parentObj.TransformPoint(localPos));
		else GetComponent.<Rigidbody>().MovePosition(parentObj.position + positionOffset);
		GetComponent.<Rigidbody>().MoveRotation(parentObj.rotation);
		//transform.localScale=parentObj.lossyScale;
	}
}