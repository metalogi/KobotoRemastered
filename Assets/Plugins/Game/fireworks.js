var particles : Particle[];
var explosion: GameObject;
var on:boolean=false;
var smg:SoundManagerScript;
var rate:float;
var count:int;
var debugExpCount:int;
var debugParticleCount:int;

var sfx : AudioSource[];

function LateUpdate () {
	if(on)
	{count=0;
		if (Random.value<Time.deltaTime*(rate+Mathf.Sin(100*Time.time))) GetComponent.<ParticleEmitter>().Emit(1);
	 var particles = GetComponent.<ParticleEmitter>().particles;
    for (var i=0; i<particles.Length; i++) 
    {	
    	if ((particles[i].velocity.y <18)&&(particles[i].velocity.y >-5))
    	{
    		count++;
    		//smg.fireworksPopSound();
    		var exp:GameObject =Instantiate(explosion, particles[i].position, Quaternion.identity);
    		
    		if (sfx.length >0)
    		{
    			var si :int = Random.value * sfx.length;
    			sfx[si].Play();
    		}
    		//particles[i].energy =-110;
    		particles[i].velocity.y=0;
    		particles[i].size*=8;
    		var expEmitter:ParticleEmitter = exp.GetComponent(ParticleEmitter);
    		var expAnimator:ParticleAnimator = exp.GetComponent(ParticleAnimator);
    		expEmitter.emit=true;
    		expEmitter.Emit(110+Random.value*40);
    		//expAnimator
    		 var modifiedColors : Color[] = expAnimator.colorAnimation;
    		 var randomCol:Color;
    		 var randomCol2:Color;
    		 var r2Vec:Vector3=Random.onUnitSphere;
    		 randomCol2=Color(r2Vec.x,r2Vec.y,r2Vec.z,1);
    		 randomCol.a=1;
    		 randomCol.r=(Random.value>0.5)? 0 :1;
    		 randomCol.g=(Random.value>0.5)? 0.2 :1;
    		 randomCol.b=(Random.value>0.5)? 0 :0.3;
    		// if (randomCol == Color.white) randomCol.b=0;
    		 if (randomCol == Color.black) randomCol.r=1;
    		modifiedColors[0] =Color.black;
    		modifiedColors[1] =Color.Lerp(modifiedColors[0],randomCol,0.5);
    		 modifiedColors[2] =randomCol;
    		 modifiedColors[3] =Color.Lerp(randomCol,randomCol2,0.5);
    		 modifiedColors[4] =randomCol2;
    		 modifiedColors[3].a=1;
    		 modifiedColors[4].a=1;
    		 
    		 particles[i].color=randomCol;
    		 
    		  expAnimator.colorAnimation = modifiedColors;
    		 
    		 //particles[i].velocity.y=1000;
    		 DestroyDelayed(exp);
    	}
    	if (particles[i].velocity.y<-8)
    	{
    		particles[i].velocity.y=0;
    		particles[i].size *= 0.6;
    	}
		GetComponent.<ParticleEmitter>().particles=particles;
    }
    debugParticleCount=particles.length;
    debugExpCount=count;
    
	}
}

function Awake()
{
	count=0;
	smg =FindObjectOfType(SoundManagerScript);
	//sfx = GetComponentsInChildren(AudioSource);
}

function TurnOn()
{
	on=true;
	GetComponent.<ParticleEmitter>().emit=true;
	var clouds:Cloud[] =FindObjectsOfType(Cloud);
	for (var cloud:Cloud in clouds)
	{
		var rend:MeshRenderer = cloud.GetComponent(MeshRenderer);
		if (rend) rend.enabled=false;
	}
}

function DestroyDelayed(obj:GameObject)
{
	yield WaitForSeconds(2);
	Destroy (obj);
}