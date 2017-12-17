var Stompers : Stomper[];


function OnTriggerEnter (col:Collider) {
	var Junc:Juncore = col.GetComponent(Juncore);
	if(Junc)
	{
	for (var stomp : Stomper in Stompers) stomp.Anger(true);	
		
	}
}