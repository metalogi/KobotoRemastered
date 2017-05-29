function Start()
{
	yield WaitForSeconds (Random.value *3);
	GetComponent.<Animation>().Play();
	
}

function Update () {
}