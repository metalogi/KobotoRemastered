Shader "Water" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
          _Tint("TintColor", Color) =(1,1,1,1)
         _alphTest("Alpha Test", Range (0, 1)) = 0.5
         //_Ref("Ref", 2D) = "white" {TexGen SphereMap}
    }
    SubShader
     { 
        Pass {
  			Tags { "Queue" = "Transparent+10" }
  			AlphaTest Greater [_alphTest]
        	Blend SrcAlpha OneMinusSrcAlpha	
        	
        
            SetTexture[_MainTex]
            	{
            		constantColor[_Tint]
            		Combine constant, texture*constant
            	
          		}
          	//	SetTexture[_Ref]
          	//	{
          	//		Combine texture*previous
          	//	}
          	 }
            
        
     }
}