var targets : GameObject[];
var stopOnExit:boolean =false;
private var on:boolean =true;
var onceOnly:boolean=true;
var delay : float =0;

function OnTriggerEnter (col:Collider) {
	var Junc:Juncore = col.GetComponent(Juncore);
	if(Junc)
	{
	print ("Trigger");
	if (on) 
	{
		yield WaitForSeconds(delay);
		for (var target:GameObject in targets)
	target.BroadcastMessage("Activate",true);
	}
	if(onceOnly) on= false;
	}
}

function OnTriggerExit (col:Collider) {
	var Junc:Juncore = col.GetComponent(Juncore);
	if(Junc)
	{
	if (stopOnExit) for (var target:GameObject in targets) target.BroadcastMessage("Activate",false);
	}
}

function Reset(v:boolean)
{
	on=true;
}