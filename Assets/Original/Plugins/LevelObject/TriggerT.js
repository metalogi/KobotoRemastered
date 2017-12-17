var target : GameObject;
var stopOnExit:boolean =false;
private var on:boolean =true;
var onceOnly:boolean=true;

function OnTriggerEnter (col:Collider) {
	var Junc:Juncore = col.GetComponent(Juncore);
	if(Junc)
	{
	print ("Trigger");
	if (on) 
	target.BroadcastMessage("Activate",true);
	if(onceOnly) on= false;
	}
}

function OnTriggerExit (col:Collider) {
	var Junc:Juncore = col.GetComponent(Juncore);
	if(Junc)
	{
	if (stopOnExit) target.BroadcastMessage("Activate",false);
	}
}

function Reset(v:boolean)
{
	on=true;
}