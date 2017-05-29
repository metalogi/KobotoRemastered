var on:boolean =true;
var waveAmp:Vector2=Vector2(5,20);
var waveFreq:Vector2=Vector2(5,5);
var wavePhase:Vector2=Vector2.zero;

var waveTime:float;
private var trans:Transform;
private var splashSound:AudioSource;
var basePos:Vector3;

function Awake()
{
	trans= transform;
	//waveTime=wavePhase*waveFreq;
	basePos=trans.position;
	 splashSound= GetComponent(AudioSource);
}

function Update () {
	if (on)
	{	
		trans.position=basePos+Vector3(0, waveAmp.x*Mathf.Cos((waveTime+wavePhase.x)*waveFreq.x), waveAmp.y*Mathf.Sin((waveTime+wavePhase.y)*waveFreq.y));
		waveTime+=Time.deltaTime;
	}
}
var vel:Vector3;


function GetPosition(offset:float)
{
	return Vector3(0, waveAmp.x*Mathf.Cos((offset+waveTime+wavePhase.x)*waveFreq.x), waveAmp.y*Mathf.Sin((offset+waveTime+wavePhase.y)*waveFreq.y));;
}

function GetVelocity()
	{	
		
			vel=Vector3(0,waveAmp.x*Mathf.Sin((waveTime+wavePhase.x)*waveFreq.x),-waveAmp.y*Mathf.Cos((waveTime+wavePhase.y)*waveFreq.y));
		
		return vel;
	}

function OnTriggerEnter(col:Collider)
{
	
	var junc:Juncore=col.GetComponent(Juncore);
	var ridge: Rigidbody = col.GetComponent(Rigidbody);
	if (junc) yield junc.Drown();
	if ((junc || ridge)&&(col.gameObject.tag!="noSplash") && splashSound) splashSound.Play();
	
}