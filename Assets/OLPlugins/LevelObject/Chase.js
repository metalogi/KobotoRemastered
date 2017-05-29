//speeds up bad cloud if its lagging behind


private var spl: SplineFollow;
private var playerJ : Juncore;
private var dist : float;
private var on:boolean=false;
var defaultSpeed : float=100.0;
var speedComp : float = 2;
var distanceThreshold : float =100.0;

private var resetSpeed : float;
private var resetSpeedComp : float;

var sound:AudioSource;

function Start()
{
	sound = GetComponent(AudioSource);
	resetSpeed= defaultSpeed;
	resetSpeedComp = speedComp;
	on=false;
	spl= GetComponent(SplineFollow);
	if (!spl) Debug.Log("Error: not attached to spline");
	
	yield WaitForSeconds(0.5);
	 playerJ  = FindObjectOfType(Juncore);
	 on=true;
	spl.pathSpeed = defaultSpeed;
	spl.SetDeltaT();
}

function Update () {
	if(on)
	{
	dist = (playerJ.trans.position - transform.position).magnitude;
	
	spl.pathSpeed = defaultSpeed;
		if (dist > distanceThreshold)
		{
			spl.pathSpeed += (dist-distanceThreshold) * speedComp;
			//if (sound) sound.volume=0.1;
		}
		//if (sound) sound.volume = Mathf.Lerp(0.8,0, 0.5*dist/distanceThreshold);
	spl.SetDeltaT();
		
	}
	
}

function Reset(v:boolean)
{
	defaultSpeed = resetSpeed;
	speedComp = resetSpeedComp;

}