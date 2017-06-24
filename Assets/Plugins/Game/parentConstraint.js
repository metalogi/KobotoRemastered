var on:boolean=true;
var target:Transform;
var parentToWorld:boolean =true;

function Awake()
{
	if (parentToWorld) transform.parent =null;
	
}
function FixedUpdate () {
	if (on)
	transform.position=target.transform.position;
	transform.rotation=target.transform.rotation;
	
}