var clayer: int;

function Start () {
	var thisBCol:BoxCollider = GetComponent(BoxCollider);
	
	if(thisBCol)
	{
	var allBColl:BoxCollider[] = FindObjectsOfType(BoxCollider);
	for (var coll:BoxCollider in allBColl)
	{
		var colLayerOther:CollisionLayer = coll.GetComponent(CollisionLayer);
		if (!colLayerOther || colLayerOther.clayer != clayer);
		Physics.IgnoreCollision(coll, thisBCol);
		
	}
	}
}