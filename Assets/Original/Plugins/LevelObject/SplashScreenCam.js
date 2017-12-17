var startWait:float;

function Start()
{
	yield WaitForSeconds(startWait);
	GetComponent.<Animation>().Play();
}

