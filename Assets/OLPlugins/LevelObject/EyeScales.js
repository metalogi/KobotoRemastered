var input : Transform;
var amount : float=0.3;
var offset : float=4;

function Update () {
	transform.localPosition.z = amount*input.position.y+offset;
}