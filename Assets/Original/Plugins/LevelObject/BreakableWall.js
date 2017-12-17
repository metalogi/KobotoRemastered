
var physicsBlocks : PhysicsBlock[];
var wallObjects : Rigidbody[];
var nhits: int;
var colThresh : float;
var sound : AudioSource;

var noDelay: boolean=false;
var children : Rigidbody[];

function Start()
{
	sound = GetComponent(AudioSource);
	children = gameObject.GetComponentsInChildren (Rigidbody) as Rigidbody[];
	wallObjects= new Rigidbody[children.length];
	
	for (var i: int =0; i<children.length; i++) 
	{
		wallObjects[i] =children[i];
		var block:PhysicsBlock = wallObjects[i].GetComponent(PhysicsBlock);
		if (block) {block.disintegrateAfter =nhits;block.colThreshold=colThresh;}
		
	}
	
}

function Blast () {
	

	
	
	for (var wallPiece : Rigidbody in wallObjects)
	{
		wallPiece.isKinematic =false;
	} 
	if (!noDelay) yield WaitForSeconds(0.8);
	if(sound) sound.Play();
		for (var pb : PhysicsBlock in physicsBlocks)
	{
		pb.Disintegrate();
	}
	
}

function OnTriggerEnter(col:Collider)
{
	var roll :rollingShell =col.gameObject.GetComponent(rollingShell);
	if (roll)
	{
		var inV : Vector3 = roll.ridge.velocity;
		Blast();
		yield WaitForSeconds(0.1); 
		roll.ridge.velocity = inV;
	}
}