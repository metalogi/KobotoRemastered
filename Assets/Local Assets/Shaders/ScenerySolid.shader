Shader "ScenerySolid" 
{
	
    Properties 
    {
          _Color ("Base", Color) =(1,1,1,1)
          
          
          
          _FogStart("FogStart", float) =1
          _FogEnd("FogEnd",float) =1000
          
    }
    SubShader
     {
     	Fog{
     		mode Linear
     		Color [_sceneFog]
     		Range [_FogStart], [_FogEnd]
     	}
        Pass {
        	
        	Color [_Color]
  	
            
          	 }
            
        
     }
}