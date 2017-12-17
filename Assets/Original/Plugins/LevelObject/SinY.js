var amp:float;
var freq:float;
private var paused: boolean=false;

private var startP : float;

function Awake()
{ startP = transform.position.y;
}

function Update () {
	
	if (!paused) transform.position.y = startP + amp*Mathf.Sin(Time.time*freq);
}

function GeneralPause(bool:boolean)
{
	paused = bool;
}