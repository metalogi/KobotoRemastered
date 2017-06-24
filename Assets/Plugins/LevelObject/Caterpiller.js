var mouth : Transform;
var mouthDeathZone : DeathZone;
var distanceToFood : float;
var eatDistance : float=60;
var viewDistance : float =200;
var walkSpeed : float=7;
private var anim : Animation;
var walking : boolean =false;
var eating : boolean=false;
var cam :CameraManager ;

private var target:Transform;

function Awake()
{
	cam = GetComponent.<Camera>().main.GetComponent(CameraManager);
	mouthDeathZone = mouth.GetComponent.<Collider>().GetComponent(DeathZone);
	//anim = GetComponent(Animation);
}

function Walk (food:CaterpillerFood) {
	print ("new food!");
	target =food.transform;
	distanceToFood = Mathf.Abs(target.position.z - mouth.position.z);
	if (!eating && distanceToFood<viewDistance && distanceToFood>eatDistance)
	{
		walking =true;
		 GetComponent.<Animation>().Stop("eat");
		 mouthDeathZone.on =false;
		 food.seen=true;
	}
	if (!eating && walking)
	{
	while (distanceToFood>eatDistance && walking &&!eating)
	{	
		
		if (!eating && distanceToFood<viewDistance)
		{
		
		GetComponent.<Animation>().Stop("eat");
		if (!GetComponent.<Animation>().isPlaying) GetComponent.<Animation>().CrossFade("walk");
		if (!paused) transform.position.z += walkSpeed * Time.deltaTime;
		}
		yield;
	}
	walking =false;
	 Eat (target);
	}
	
}

function Eat(food:Transform)
{
	eating =true;
	mouthDeathZone.on =true;
	
	GetComponent.<Animation>().CrossFade("eat");
	//food.rigidbody.isKinematic =true;
	food.GetComponent.<Renderer>().enabled =false;
	food.GetComponent.<Collider>().isTrigger=true;
	
	yield WaitForSeconds(3);
	eating =false;
	cam.interest = null;
}


function Update()
{
	if (target) distanceToFood = Mathf.Abs(target.position.z - mouth.position.z);;
}

function Reset(v:boolean)
{
	eating =false;
	walking =false;
	mouthDeathZone.on =false;
	
	yield WaitForSeconds(3);
	GetComponent.<Animation>().Play("walk");
	yield WaitForSeconds(0.1);
	GetComponent.<Animation>().Stop();
}

function Activate(v:boolean)
{
	eating =true;
	mouthDeathZone.on =true;
	GetComponent.<Animation>().Play("eat");
	var wasWalking : boolean =walking;
	walking =false;
	yield WaitForSeconds(3);
	
	if (wasWalking&&eating) walking=true;
	eating =false;
	mouthDeathZone.on =false;
	
	
}

var paused : boolean;
function GeneralPause(v:boolean)
{
	paused =v;
}