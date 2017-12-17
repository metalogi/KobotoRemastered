private var groundPop : boolean = false;
private var depopifyDelay : float = 0.0;
private var popAmount : float = 0.0;

var popTime = 1.0;
var dropSpeed = 20;
var dropHeight = 28;

function OnTriggerEnter( other : Collider )
{
	if( !groundPop )
	{
		groundPop = true;
		
	}
}
