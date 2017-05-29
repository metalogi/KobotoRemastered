var trans : Transform;
var ridge : Rigidbody;
 
function Awake()
{
	ridge = GetComponent(Rigidbody);
	trans= GetComponent (Transform);
}

/*
function FixedUpdate () {
	if (transform.eulerAngles.x >3) transform.eulerAngles.x=0;
	if (transform.eulerAngles.y-90 >3) transform.eulerAngles.y=90;
	}
	*/