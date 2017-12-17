var emitter : ParticleEmitter;
//var trans :Transform;

function Awake()
{
	//emitter =GetComponentInChildren(ParticleEmitter);
	emitter.emit =false;
	//trans =emitter.transform;
}

function TurnOn (o:boolean) {
	emitter.emit =o;
}