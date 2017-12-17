Shader "SplashShadow" {
	Properties {
		_Tint ("Main Color", Color) = (1,1,1,1)
		_MainTex ("Base (RGB)", 2D) = "white" {}
		
	}
	SubShader 
	{
		
		Tags { "Queue" = "Transparent" }
		Pass{
			Blend DstColor Zero    
			SetTexture[_MainTex]
            	{
            		                
            		constantColor[_Tint]
            		Combine texture*constant, texture*constant
				}
		
			} 
	
	}

}