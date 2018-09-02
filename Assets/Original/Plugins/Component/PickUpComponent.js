var index : int;
var editor : UIEditor;
var on : boolean = true;
private var renderers : Array;
private var localPos : Vector3;
private var cam:CameraManager;
var regenerate : boolean  =false;

private var pickedUp = false;

function Awake()
{
	//cam = Camera.main.GetComponent(CameraManager);
	//editor =FindObjectOfType(UIEditor);
	//renderers = GetComponentsInChildren (MeshRenderer);
	//localPos = transform.localPosition;
}

function Update()
{
	//if (regenerate)
	//{
	//	if (!on && editor.components[index].count == 0)
	//	{
	//		Reset(true);
	//	}
	//}
}

function OnTriggerEnter (col:Collider) {
	return;
	var junc : Juncore = col.GetComponent(Juncore);
	if (junc&&on)
	{
		
		on=false;
		var iconPos:Vector3 = Vector3(editor.components[index].ScreenPosX, Screen.height-editor.components[index].ScreenPosY, 50);
		editor.SwapAnimScreenSpace(gameObject,editor.SelectedKoboto.transform,iconPos, 0.2,true);
		cam.PickUpSound();
		yield WaitForSeconds(0.2);
		editor.components[index].count ++;
		editor.components[index].countString =editor.components[index].count.ToString();
		for (var rend : MeshRenderer in renderers) rend.enabled=false;
	}
	
}

function Reset(bool:boolean)
{
	transform.localPosition = localPos;
	on = bool;
	if (on) for (var rend : MeshRenderer in renderers) rend.enabled=true;
}