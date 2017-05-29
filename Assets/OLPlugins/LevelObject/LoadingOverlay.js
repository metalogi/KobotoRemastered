


private var meshR:MeshRenderer;

function Awake()
{
	meshR= GetComponent(MeshRenderer);
	SetOn(false);
}

function SetOn(s:boolean)
{
	meshR.enabled =s;
}
