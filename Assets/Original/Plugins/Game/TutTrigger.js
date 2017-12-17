var tut:Tutorial2;
var n:int;

function OnTriggerEnter (col:Collider) {
	if (col.gameObject.GetComponent(Juncore)) {print ("triggerring Tutorial " + n);tut.PlayTutorial(n);}
}