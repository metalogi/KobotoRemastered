
function Awake () {
Fade();
}

var timer : float;
var fadeTime:float=1;

function Fade()
{
	
	timer  =fadeTime;
	var mat : Material = GetComponent.<Renderer>().material;
	while (timer >0)
	{
		//print (timer);
		mat.color.a =timer/fadeTime;
		timer -=Time.deltaTime;
		yield;
	}
}

