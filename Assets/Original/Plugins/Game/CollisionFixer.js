
function OnCollisionEnter (coll:Collision) {
	coll.rigidbody.position.x=0;
	coll.rigidbody.velocity.x=0;
}

function OnCollisionStay (coll:Collision) {
	coll.rigidbody.position.x=0;
	coll.rigidbody.velocity.x=0;
	//var cJunc:Juncore =col.gameObject.GetComponent(Juncore);
	//if (cJunc&&!cJunc.IsOn())
}
function OnCollisionExit (coll:Collision) {
	coll.rigidbody.position.x=0;
	coll.rigidbody.velocity.x=0;
}