var emitter : ParticleEmitter;
var baseP : Vector3;

function Awake(){
	emitter= GetComponent(ParticleEmitter);
	Seed();
}

function Update () {
}

function Seed()
{
	emitter.Emit(50);
	var particles = GetComponent.<ParticleEmitter>().particles;
	for (var i=0; i<particles.Length; i++) 
    {
    	particles[i].position.y += (Random.value-0.5) * 500;
    	particles[i].velocity =  Random.insideUnitSphere * 20 - Random.value*40*Vector3.up;
    	
    }
    GetComponent.<ParticleEmitter>().particles = particles;
}