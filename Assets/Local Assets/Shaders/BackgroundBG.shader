Shader "BackPLaneBG" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
         
     
    }
    SubShader
     { Tags { "Queue" = "Background" }

        Pass {

        	Blend SrcAlpha OneMinusSrcAlpha	
            SetTexture[_MainTex]
            	{
            		
        
            		Combine texture, texture
          		}
          	 }
            
        
     }
}