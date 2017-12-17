
var replacementTex:Texture2D[];

var texBuffer:Texture2D[];
var n:int; //number of materials
var switched:boolean=false;
var rend:MeshRenderer;

function Awake()
{
	rend=GetComponent(MeshRenderer);
	n= rend.sharedMaterials.length;

	texBuffer = new Texture2D[n];
	for (var i:int=0; i<n;i++)
	{

		texBuffer[i] =rend.sharedMaterials[i].GetTexture("_MainTex");
	}
}

function ReplaceMats () 
{
	if(!switched)
	{


	for (var i:int=0; i<n;i++)
	{
		texBuffer[i] =rend.sharedMaterials[i].GetTexture("_MainTex");
		rend.materials[i].SetTexture("_MainTex", replacementTex[i]);

	}
	switched =true;
	}
}

function RestoreMats()
{
	if (switched)
	{
	
	for (var i:int=0; i<n;i++)
	{

		rend.materials[i].SetTexture("_MainTex", texBuffer[i]);
	}
	switched=false;
	}
}