function TurnOffWorldCollisions()
{
	var thisCol:MeshCollider = GetComponent(MeshCollider);
	
	if(thisCol)
	{
	var allColl:BoxCollider[] = FindObjectsOfType(BoxCollider);
	for (var coll:BoxCollider in allColl)
	{
		if (coll.gameObject.layer ==8) Physics.IgnoreCollision(coll, thisCol);
		//var junc:Juncore = coll.gameObject.GetComponent(Juncore);
		//if (!junc) Physics.IgnoreCollision(coll, thisCol);
	}
	}
	
	var thisBCol:BoxCollider = GetComponent(BoxCollider);
	if(thisBCol)
	{
	var allBColl:BoxCollider[] = FindObjectsOfType(BoxCollider);
	for (var coll:BoxCollider in allBColl)
	{
		if ((coll.gameObject.layer ==8)&&(coll!=thisBCol)) Physics.IgnoreCollision(coll, thisBCol);
		//var junc:Juncore = coll.gameObject.GetComponent(Juncore);
		//if (!junc) Physics.IgnoreCollision(coll, thisCol);
	}
	}
	
}

function Start()
{
	TurnOffWorldCollisions();
}