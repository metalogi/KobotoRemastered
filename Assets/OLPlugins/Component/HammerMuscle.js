var flipTime : float =0.15;
var cooldownTime : float =1;
var detectRange : float =10;
var on : boolean;
var obj:GameObject;
//function OnTriggerEnter(col : Collider) {if (on) Test(col);}
//function OnTriggerStay(col : Collider) {if (on) Test(col);}
var sound : AudioSource;

function Update()
{
	if(on)
	{
	var fwd = transform.right;
	var hits : RaycastHit[];
	//hits= Physics.RaycastAll( Ray(transform.position+fwd*1, fwd), detectRange);
	hits= Physics.RaycastAll( Ray(transform.position-fwd, fwd), detectRange*1.5);
	for (var hit:RaycastHit in hits)
	{
		//var Junc : Juncore =hit.collider.GetComponent(Juncore);
		//if(!Junc)
		//{
		//print( "hit: " +hit.collider.gameObject.name);
		Test(hit.collider);
		//}
	}
	
	if (on)
	{
	hits= Physics.RaycastAll( Ray(transform.position+fwd*detectRange, Vector3(0,-1,0)), detectRange ) ;
	for (var hit:RaycastHit in hits)
	{
		if(on) Test(hit.collider);
	}
	}
	
	if (on)
		{
	hits= Physics.RaycastAll( Ray(transform.position, Vector3(0,-1,0)), detectRange ) ;
	for (var hit:RaycastHit in hits)
	{
		if(on) Test(hit.collider);
	}
	}
	}
}


function Test(col:Collider)
{
	obj = col.gameObject; 
	var floorShatter : ShatterBlast = col.GetComponent( ShatterBlast );
	var wall: BreakableWall =col.GetComponent( BreakableWall );
	var ridge: Rigidbody =col.gameObject.GetComponent.<Rigidbody>();
	var Junc : Juncore =col.GetComponent(Juncore);
	
	if (floorShatter) {floorShatter.Blast();Flip();}
	if (wall) {wall.Blast();Flip();}
	if (ridge&&!Junc)
	{
		print ("hittingRigidbody");
		ridge.AddForce(Vector3(0,0,8000), ForceMode.Impulse);
		Flip();
	}
}

function Flip()
{
	print ("FLip");
	sound.Play();
	on = false;
	var timer:float = 0;
	var ang : float=0;
	while (timer<flipTime)
	{
		ang = timer*45/flipTime;
		transform.localRotation = Quaternion.Euler( transform.localRotation.x, transform.localRotation.y, -ang );
		timer += Time.deltaTime;
		yield;
	}
	transform.localRotation = Quaternion.Euler( 0, 0, 0);
	yield WaitForSeconds(cooldownTime);
	on =true;
	
}

function Awake()
{
	sound = GetComponent(AudioSource);
	on =true;
}

function ResetHammer()
{
	on =true;
	transform.localRotation = Quaternion.Euler( 0, 0, 0);
}
