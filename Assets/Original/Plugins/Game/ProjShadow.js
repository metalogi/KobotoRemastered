private var lightDir:Vector3;
private var restPos:Vector3;

private var parentTrans:Transform;
var rotzFix:double=20;
var yOffset:double=2;
private var lightRot:Quaternion;

private var levelShadowRotate:float =0;

var trans : Transform;





function Awake()
{	parentTrans= transform.parent;
	var lite:Light =FindObjectOfType(Light);
	var liteTrans:Transform =lite.transform;
	lightRot= liteTrans.rotation;
	lightDir =liteTrans.TransformDirection(Vector3.forward);
	transform.rotation=lightRot;
	var lightDef:LightDef=lite.GetComponent(LightDef);
	if (lightDef) levelShadowRotate=lightDef.GetLevelShadowRotate();
	
	transform.position = parentTrans.position-10*lightDir;
	transform.position.y +=yOffset;
	transform.rotation=lightRot;
	transform.eulerAngles.z+=rotzFix-parentTrans.eulerAngles.x+levelShadowRotate;
	
	trans =transform;
	
	trans.parent =null;
	
	
}


function LateUpdate () 
{
 trans.position= parentTrans.position-10*lightDir;
 trans.position.y +=yOffset;
/*
	transform.position = parentTrans.position-10*lightDir;
	transform.position.y +=yOffset;
	transform.rotation=lightRot;
	var lite:Light =FindObjectOfType(Light);
	var lightDef:LightDef=lite.GetComponent(LightDef);
	if (lightDef) levelShadowRotate=lightDef.GetLevelShadowRotate();
	transform.eulerAngles.z+=rotzFix-parentTrans.eulerAngles.x+levelShadowRotate;
	*/
	
	
}

