var line : LineRenderer;

var start : Transform;
var end : Transform;
var autoUpdate : boolean=true;

var StartObject : Transform;
var EndObject : Transform;

private var startOffset : Vector3;
private var endOffset : Vector3;

function Update () {
	if (autoUpdate) 
	{
		if (StartObject) start.position = StartObject.position + startOffset;
		if (EndObject) end.position = EndObject.position +endOffset;
		SetEnds();
	}
}

function Start()
{
	line = GetComponent(LineRenderer);
	if (StartObject) startOffset = start.position-StartObject.position;
	if (EndObject) endOffset = start.position-StartObject.position;
	SetEnds();
}

function SetEnds () {
	
	line.SetPosition (0, start.position);
	line.SetPosition (1, end.position);
}