var target:SplineFollow;
var stopOnExit:boolean =false;
private var on:boolean =true;
var onceOnly:boolean=true;
var delay : float =0;
function OnTriggerEnter (col:Collider) {
	var Junc:Juncore = col.GetComponent(Juncore);
	if(Junc)
	{
	print ("Trigger");
	yield WaitForSeconds(delay);
	if (on) 
	{
	target.GeneralPause(false);
	if (!target.on) target.Activate(true);
	}
	if(onceOnly) on= false;
	}
}

function OnTriggerExit (col:Collider) {
	var Junc:Juncore = col.GetComponent(Juncore);
	if(Junc)
	{
	if (stopOnExit) target.GeneralPause(true);
	}
}

function Reset(v:boolean)
{
	on=true;
}