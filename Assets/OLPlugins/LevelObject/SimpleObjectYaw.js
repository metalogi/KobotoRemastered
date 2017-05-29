
var rate = 1.0;

function Update () 
{
	transform.rotation = Quaternion.Euler( 0, rate*Time.time, 0 );
}