var playAlready = false;
var startPos:Vector3;
var startRot:Quaternion;


function Start()
{
	startPos = transform.position;
	startRot = transform.rotation;
}
function OnTriggerEnter()
{
	if( !playAlready )
	{
		if( transform.parent.GetComponent( Animation ) )
			transform.parent.GetComponent.<Animation>().Play();
		playAlready = true;
	}
}
function Reset(v:boolean)
{
		
	playAlready=false;
	if( transform.parent.GetComponent( Animation ) )
			transform.parent.GetComponent.<Animation>().Stop();
	 transform.position =startPos;
	 transform.rotation =startRot;
}