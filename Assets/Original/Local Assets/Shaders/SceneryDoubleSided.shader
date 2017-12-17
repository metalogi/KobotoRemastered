Shader "SceneryDoubleSided" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
          _alphTest("Alpha Test", Range (0, 1)) = 0.5
          _Tint("TintColor", Color) =(1,1,1,1)
     
    }
    SubShader
     { Tags { "Queue" = "Transparent+1" }
		Cull Off
        Pass {

        	Blend SrcAlpha OneMinusSrcAlpha	
            SetTexture[_MainTex]
            	{
            		
            		constantColor[_Tint]
            		Combine texture*constant, texture*constant
          		}
          	 }
            
        
     }
}