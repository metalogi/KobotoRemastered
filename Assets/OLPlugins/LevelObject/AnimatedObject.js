
private var playCount:int=0;
var playOnce:boolean=true;

var renderers:Array;
function Start()
{

	renderers= GetComponentsInChildren(MeshRenderer);
	for (var r:MeshRenderer in renderers) r.enabled=false;
	//Activate();
}
function Activate () {
	
	for (var r:MeshRenderer in renderers) r.enabled=true;
	if ((playCount==0)||(!playOnce)) GetComponent.<Animation>().Play("On");
	playCount++;
	
}