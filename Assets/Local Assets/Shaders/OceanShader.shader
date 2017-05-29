Shader "Ocean" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
    }
    SubShader
     { Tags { "Queue" = "Transparent" }
     	
        Pass {
  	AlphaTest Greater 0.5
        	Blend SrcAlpha OneMinusSrcAlpha	
            SetTexture[_MainTex]
            	{
            		Combine texture, texture
          		}
          	 }
            
        
     }
}
