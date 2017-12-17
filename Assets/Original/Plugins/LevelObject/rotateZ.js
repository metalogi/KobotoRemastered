var speed : float=4;

/*
function Update () {
	transform.eulerAngles.z+= speed*Time.deltaTime;
}
*/

var trans: Transform;
function Awake()
{
	trans =transform;
}
function FixedUpdate(){
	trans.Rotate(Vector3(0,0,1) * speed*Time.deltaTime);
}