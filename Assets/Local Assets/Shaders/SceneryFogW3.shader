Shader "SceneryW3" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
          //_alphTest("Alpha Test", Range (0, 1)) = 0.5
          _Tint("TintColor", Color) =(1,1,1,1)
         _Fog("FogColor", Color) =(1,1,1,1)
          _FogStart("FogStart", float) =1
          _FogEnd("FogEnd",float) =1000
    }
    SubShader
     { Tags { "Queue" = "Transparent" }
     	     	Fog{
     		mode Linear
     		Color [_Fog]
     		Range [_FogStart], [_FogEnd]
     	}
        Pass {
        	//AlphaTest Greater [_alphTest]
  	
        	Blend SrcAlpha OneMinusSrcAlpha	
            SetTexture[_MainTex]
            	{
            		
            		constantColor[_Tint]
            		Combine texture*constant, texture*constant
          		}
          	 }
            
        
     }
}