var ridge : Rigidbody;
var magForce : Vector3;
var on : boolean; 
var magTrans : Transform; 
var strength :float =10;
var magRange : float =50;
var junc : Juncore ;
var modifyDragOnTarget : boolean=false;
var onDrag : float=1.2;
var offDrag: float =0.5;

function Awake()
{
	if  (modifyDragOnTarget) ridge.drag=offDrag;
}

function FixedUpdate()
{
	if (on)
	{
	var magVec : Vector3 =magTrans.position- transform.position;
	var magAmp : float;
	if (magVec.magnitude <magRange) 
	{
		magAmp = Mathf.Lerp (0, strength,magVec.magnitude/magRange);
		
	magForce = magVec * magAmp;
	magForce.x =0;
	magForce.z *=20;
	//magForce.z = junc.MoveForce.z *4;
	ridge.AddForce(Time.deltaTime* magForce *5*ridge.mass);
	}
	}
}

function OnTriggerEnter (col : Collider)
{
	 junc  = col.GetComponent(Juncore);
	
	if (junc)
	{
		//if (ridge.isKinematic) ridge.isKinematic = false;
		on =junc.hasMagnet;
		if (on) 
		{magTrans =junc.trans;
		if  (modifyDragOnTarget) ridge.drag=onDrag;
		 if (!junc.magBeam.on) {junc.magnoProp =true;junc.magBeam.Activate();}
		}
	}
}

function OnTriggerStay (col : Collider)
{
	junc = col.GetComponent(Juncore);
	
	if (junc )
	{
		
		//if (ridge.isKinematic) ridge.isKinematic = false;
		on =junc.hasMagnet;
		if (on) 
		{magTrans =junc.trans;
		if  (modifyDragOnTarget) ridge.drag=onDrag;
		 if (!junc.magBeam.on) {junc.magnoProp =true;junc.magBeam.Activate();}
		}
	}
}

function OnTriggerExit (col : Collider)
{
	if (col.gameObject.layer ==9)
	{
		 //ridge.isKinematic = true;
		on =false;
		if  (modifyDragOnTarget) ridge.drag=offDrag;
		if (junc &&junc.hasMagnet) {junc.magnoProp=false;junc.magBeam.Deactivate();junc.magnetized=false;}
	}
}

function Reset(v:boolean)
{
	//ridge.isKinematic = true;
	if (junc &&junc.hasMagnet) {junc.magnoProp=false;junc.magBeam.Deactivate();}
	if  (modifyDragOnTarget) ridge.drag=offDrag;
	on =false;
}