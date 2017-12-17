var on:boolean;
var disabled:boolean=false;
var mag:float;
var offset:Vector3;
private var gen:GenericFunctions;
private var basePos:Vector3;
private var baseRot:Quaternion;

var VacantMat:Material;
var OccupiedMat:Material;

private var mat:MeshRenderer;

var target:GameObject;

var junc:Juncore;

function Awake () {
	gen =FindObjectOfType(GenericFunctions);
	basePos=transform.localPosition;
	baseRot=transform.localRotation;
	mat=GetComponent(MeshRenderer);
	disabled=false;
	mat.material = VacantMat;
	
}

function FixedUpdate () {
	if (on)
{
	var t:float= gen.GetTilt();
	
	target.SendMessage("TiltControl", 1000*mag*t);
	
}
//if (junc) junc.UpdateParentPos();
}

function LateUpdate()
{
	
}

function Reset(v:boolean)
{
	on=false;
	junc =null;
	disabled=false;
	mat.material = VacantMat;
	transform.localPosition = basePos;
	transform.localRotation = baseRot;
}

function OnTriggerStay (col:Collider) {
	
var incoming:Juncore =col.gameObject.GetComponent(Juncore);
if (incoming&&!junc&&!disabled) 
	{	
		if (col.GetComponent.<Rigidbody>()&& !incoming.HasSpring())
		{
		//if (junc) Eject();
		junc=incoming;
		col.gameObject.GetComponent.<Rigidbody>().velocity=Vector3.zero;
		on=true;
		disabled=true;
		mat.material = OccupiedMat;
		junc.SetParent(this.gameObject,offset);
		junc.lock=true;
		}
	}
}

function OnTriggerExit(col:Collider){
	var incoming:Juncore =col.gameObject.GetComponent(Juncore);
	if (incoming ==junc)
	{
	Eject();	
	/*	
	yield WaitForSeconds(2.5);
	disabled =false;
	junc=null;
	mat.material=VacantMat;
	*/
	}
}
function Eject() {

		TurnOff();
		if (junc) junc.SetParent(null,Vector3.zero);
		junc =null;
		yield WaitForSeconds(1.5);
		disabled =false;
		mat.material=VacantMat;
	
}

function TurnOff() {on=false; target.SendMessage("TiltControl",0);}
function TurnOn() {on=true;}