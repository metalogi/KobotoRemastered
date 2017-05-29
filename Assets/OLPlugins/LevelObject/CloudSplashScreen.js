var cloudSpeed : float= 5;
var wss : boolean =false;
var max:float =200;
var min:float =-200;


function Update()
{
	if (wss)
	{
		if (transform.position.z <max) transform.position.z += cloudSpeed*Time.deltaTime;
	else transform.position.z = min;
	}
	else
	{
	if (transform.position.x <max) transform.position.x += cloudSpeed*Time.deltaTime;
	else transform.position.x = min;
	}
}
