 var tiltSpeed:float =1;
var tilt:float =50;

function Update () {
	transform.eulerAngles = Vector3(0,90,tilt*Mathf.Sin(tiltSpeed*Time.time));
}