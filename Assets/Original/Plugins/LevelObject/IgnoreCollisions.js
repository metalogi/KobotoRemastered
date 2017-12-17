var ignoreList : GameObject[];



function Start()
{
	for (var col : GameObject in ignoreList) Physics.IgnoreCollision(GetComponent(Collider), col.GetComponent(Collider));
}