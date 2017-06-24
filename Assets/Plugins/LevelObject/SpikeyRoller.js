
function OnTriggerEnter (col:Collider) {
	var phys:PhysicsBlock = col.GetComponent(PhysicsBlock);
	if (phys) phys.Disintegrate();
}