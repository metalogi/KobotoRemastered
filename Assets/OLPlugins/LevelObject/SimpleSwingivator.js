var buttons : Button[];

private var origin : Vector3;
var rate = 1.0;
var spread = 3.0;
var offSet = 0.0;

var on : boolean;
var x : double;

private var oldPos : Vector3;

function Awake ()
{
	origin = transform.position;
	oldPos=transform.position;
	
	Reset(true);
}

function Reset(v:boolean)
{
	on = (buttons.length == 0);
	x=0;
}

function Update () 
{

	for( curButton in buttons )
	{
		if( curButton.IsPressed() )
		{
			on = true;
		}
	}
	
	if( on ) x += Time.deltaTime;
	else x = 0;

	oldPos = transform.position;
	transform.position = origin + Vector3(0,(spread/2) - Mathf.Cos(x*rate + (offSet*Mathf.PI/180))*spread/2,0);
}