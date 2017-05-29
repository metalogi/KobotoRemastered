class BonusTokenIds extends ScriptableObject
{
	@MenuItem ("Level/SetBonusTokenIDs")
	static function SetBTIDs()
	{
		var BTs : BonusToken[] = FindObjectsOfType(BonusToken);
		var i:int =0;
		for (var bt: BonusToken in BTs)
		{
			bt.identifier = i;
			i++;
		}
	}

	
}