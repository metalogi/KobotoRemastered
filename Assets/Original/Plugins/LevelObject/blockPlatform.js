var down : boolean = false;

function OnTriggerEnter (col : Collider) 
{
	var platController : SplineFollowTilt = col.GetComponent(SplineFollowTilt);
	
	if ( platController)
	{
	if (down)  platController.blockDown =true;
	else  platController.blockUp= true;
	}
}

function OnTriggerExit (col : Collider) 
{
	var platController : SplineFollowTilt = col.GetComponent(SplineFollowTilt);
	if (platController)
	{
	platController.blockDown =false;
	 platController.blockUp= false;
	}
}