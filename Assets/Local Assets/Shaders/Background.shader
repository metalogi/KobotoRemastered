Shader "BackPLane" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
         
     
    }
    SubShader
     { Tags { "Queue" = "Background+1" }

        Pass {

        	Blend SrcAlpha OneMinusSrcAlpha	
            SetTexture[_MainTex]
            	{
            		
        
            		Combine texture, texture
          		}
          	 }
            
        
     }
}