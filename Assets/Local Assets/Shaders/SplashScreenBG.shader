Shader "SplashScreenBG" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
          _Color("TintColor", Color) =(1,1,1,1)
         
         

    }
    SubShader
     { Tags { "Queue" = "Transparent" }
     	     	
        Pass {
  	
        	Blend SrcAlpha OneMinusSrcAlpha	
            SetTexture[_MainTex]
            	{
            		
            		constantColor[_Color]
            		Combine texture*constant, texture*constant
          		}
          	 }
            
        
     }
}