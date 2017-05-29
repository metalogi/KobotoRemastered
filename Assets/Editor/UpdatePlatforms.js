
class UpdatePlatforms extends ScriptableObject
{
@MenuItem("Connectors/UpdateSelectedPlatforms")
static function UpdateSelectedPlatforms() {
	var Sel: Transform[] =Selection.transforms;
	for (var sel:Transform in Sel)
	{
		var spl:SplineFollow = sel.GetComponent(SplineFollow);
		//con.Init();
		if (spl) 
		{
			//spl.Awake();
			spl.Reset(true);
		}
	}
}
}