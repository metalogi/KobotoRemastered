var materialId=0;
var rate=1.0;
var moveSpeed=1.0;

function Update () 
{
	if( GetComponent.<Renderer>() )
	    GetComponent.<Renderer>().materials[materialId].SetTextureOffset ("_MainTex", Vector2(Time.time*rate,0));
}

function GetSpeed()
{
	return moveSpeed;
}