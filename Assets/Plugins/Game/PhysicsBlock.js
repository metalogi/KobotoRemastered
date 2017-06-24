var startPos:Vector3;
var startRot:Quaternion;
private var startKine : boolean;
private var collisionCount : int;
var disintegrateAfter : int;

var smokePuff : GameObject;
var colThreshold : float;
var sound : AudioSource;

var startVis : boolean;
function Start()
{
	startPos = transform.position;
	startRot = transform.rotation;
	
	startKine = GetComponent.<Rigidbody>().isKinematic;
	collisionCount=0;
	sound =GetComponent(AudioSource);
	startVis = GetComponent.<Renderer>().enabled;
}



function Reset(v:boolean)
{
	 transform.position =startPos;
	 transform.rotation =startRot;
	 if (!GetComponent.<Rigidbody>().isKinematic)
	 {
	 GetComponent.<Rigidbody>().velocity = Vector3.zero;
	 GetComponent.<Rigidbody>().angularVelocity = Vector3.zero;
	 }
	 
	GetComponent.<Rigidbody>().isKinematic = startKine;
	GetComponent.<Collider>().isTrigger=false;
	GetComponent.<Renderer>().enabled =startVis;
	collisionCount=0;
}

function OnCollisionEnter(col:Collision)
{
	var colSpeed : float = col.relativeVelocity.magnitude;
	if (sound &&(colSpeed >20)) 
	{
		sound.volume =Mathf.Lerp(0.1,1,(colSpeed-20)/(400));
		//print ("impactVolume: " + impact.volume);
		sound.Play();
		
	}
	if (!GetComponent.<Rigidbody>().isKinematic&& col.relativeVelocity.magnitude > colThreshold) collisionCount++;
	if (disintegrateAfter && collisionCount>=disintegrateAfter) Disintegrate();
}
function Disintegrate()
{
	if (GetComponent.<Renderer>().enabled)
	{
	//yield WaitForSeconds(0.15);
	GetComponent.<Renderer>().enabled=false;
	GetComponent.<Collider>().isTrigger=true;
	GetComponent.<Rigidbody>().isKinematic =true;
	if (smokePuff)
	Instantiate (smokePuff, transform.position, Quaternion.identity);
	//smokePuff.transform.parent =transform;
	transform.position.x=-100;
	}
}