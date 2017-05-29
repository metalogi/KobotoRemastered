var target:Transform;
var offset:Vector3;
var keepOffset:boolean=true;
var trans : Transform;

function Awake()
{
	if (keepOffset) offset=transform.position-target.position;
	trans = transform;
	
}
function LateUpdate () {
	trans.position=target.position +offset;
	// transform.position += offset;
}