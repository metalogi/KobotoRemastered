
function Unlock () {
	yield WaitForSeconds(1);
	GetComponent.<Renderer>().enabled=false;
}