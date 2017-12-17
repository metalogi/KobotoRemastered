Shader "ForegroundThing" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
          _Tint("TintColor", Color) =(1,1,1,1)
         _Detail("Detail",2D) = "white" {TexGen ObjectLinear}
          
    }
    SubShader
     { 
        Pass {
  			
        	Tags {"Queue" = "Transparent+7"}
        	Blend SrcAlpha OneMinusSrcAlpha	
        	
        	AlphaTest Greater 0.1
            SetTexture[_MainTex]
            	{
            		constantColor[_Tint]
            		Combine texture*constant, texture*constant
            			
          		}
          		 SetTexture[_Detail]
            	{
            		constantColor[_Tint]
            		Combine texture*previous, previous
            			
          		}
          	 }
            
        
     }
}