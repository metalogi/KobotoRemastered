
class AddReflection extends ScriptableObject
{
	@MenuItem ("Custom/AddReflection")
	static function AddRef()
	{
		var Select =Selection.transforms;
		for (var sel : Transform in Select)
		{
			var refClass : MReflection =new MReflection();
			var filt : MeshFilter = sel.GetComponent(MeshFilter);
			if (filt) refClass.MakeNew(sel,filt);
			var cab :cable = sel.GetComponent(cable);
			if (cable) refClass.MakeNewCable(sel);
		}
	}
	
	
	
}