//speeds up bad cloud if its lagging behind



private var playerJ : Juncore;
private var dist : float;
private var on:boolean=false;
var defaultSpeed : float=100.0;
var speedComp : float = 2;
var distanceThreshold : float =100.0;

private var resetSpeed : float;
private var resetSpeedComp : float;

var sound:AudioSource;

var moveVector : Vector3;
private var man:UIManager;

function Start()
{
	
	sound = GetComponent(AudioSource);
	sound.Play();
	sound.volume=0;
	resetSpeed= defaultSpeed;
	resetSpeedComp = speedComp;
	on=false;
	man = FindObjectOfType(UIManager);
	
	yield WaitForSeconds(0.5);
	 playerJ  = FindObjectOfType(Juncore);
	 
	 on=true;
	
}

function FixedUpdate () {
	if(on&&man.gameMode !=2)
	{
	var mspeed : float;	
	moveVector=playerJ.trans.position - transform.position;
	dist = (playerJ.trans.position - transform.position).magnitude;
	mspeed =defaultSpeed;
	
	
		if (dist > distanceThreshold)
		{
			mspeed += (dist-distanceThreshold) * speedComp;
			//if (sound) sound.volume=0.1;
		}
		if (sound) sound.volume = Mathf.Lerp(0.3,0.01, 0.5*dist/distanceThreshold);
	moveVector = moveVector.normalized *  mspeed;
	if (!GetComponent.<Rigidbody>().isKinematic) GetComponent.<Rigidbody>().velocity = moveVector;
		
	}
	
}

function Reset(v:boolean)
{
	on =true;
	defaultSpeed = resetSpeed;
	speedComp = resetSpeedComp;

}