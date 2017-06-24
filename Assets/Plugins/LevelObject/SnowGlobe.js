var emitter : ParticleEmitter;
var pAnim : ParticleAnimator;
var base : Transform;
var o : Vector3;
var on : boolean =false;
var extraShake : float;

var flakes: int =500;

function Awake()
{
	on=false;
	if (PlayerPrefs.GetInt("WorldsUnlocked",1) >1) on=true;
	
	if (on)
	{
	emitter  = GetComponent(ParticleEmitter);
	pAnim =GetComponent(ParticleAnimator);
	emitter.Emit(flakes);
	o=base.position;
	}
	
}



private var acc:Vector3;
private var accFiltered:Vector3;
private var shakeMag:float;
private var shaking:boolean =false;
var shakeThres:float =0.2;
var AccelerometerUpdateInterval : float = 1.0 / 60.0;
private var LowPassFilterFactor : float = AccelerometerUpdateInterval / 0.1; // tweakable
private var lowPassValue : Vector3 = Vector3.zero;

function LowPassFilterAccelerometer() : Vector3 
{
	lowPassValue = Vector3.Lerp(lowPassValue, acc, LowPassFilterFactor);
	return lowPassValue;
}

function Update () {
	if (on)
	{
	
	acc=Input.acceleration;
	
	accFiltered=LowPassFilterAccelerometer();
	shakeMag = Mathf.Abs(acc.sqrMagnitude-accFiltered.sqrMagnitude);
	//print (shakeMag);
	
	
	
	pAnim.force.z = -20*accFiltered.y;
	pAnim.force.y = 40*accFiltered.x;
	
	var ps = emitter.particles;
	for (var i=0; i<ps.Length; i++) 
	{
	
		if ((shakeMag+extraShake)>shakeThres) ps[i].velocity += 20*Random.onUnitSphere * (shakeMag+extraShake);
		if ((ps[i].position.y<(o.y-2)) || (ps[i].position-o).magnitude >110)
		{ 
			ps[i].position.y = -500;
			ps[i].energy =-1;
			emitter.Emit(1);
		}
		
	}
	emitter.particles=ps;
	}
}


function Shake(mag : float, shakeTime:float)
{
	var timer :float =shakeTime;
	while (timer>0)
	{
		print ("extraShake =" + extraShake);
		extraShake= Mathf.Lerp(0,mag,timer/shakeTime);
		timer -= Time.deltaTime;
		yield;
	}
}
