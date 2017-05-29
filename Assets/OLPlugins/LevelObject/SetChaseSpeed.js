
var chase : Chase;
var newSpeed : float;
var newSpeedComp : float;

function OnTriggerEnter (col:Collider) {

	if (col.gameObject.tag == "monsta")
	{
		chase.defaultSpeed = newSpeed;
		chase.speedComp = newSpeedComp;
	}
	
}