Shader "NoLightingTint" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
          _Tint("TintColor", Color) =(1,1,1,1)
         
          
    }
    SubShader
     { 
        Pass {
  	
        	
            SetTexture[_MainTex]
            	{
            		constantColor[_Tint]
            		Combine texture*constant, texture*constant
            		
            		
          		}
          	 }
            
        
     }
}