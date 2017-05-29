Shader "trophyGlass" {
    Properties {
    	_Color ("Main Color", Color) = (1,1,1,1)
    	_Base ("Main Color", 2D) = "white" {}
    	_Ambient ("Ambient Color", Color) = (1,1,1,1)
    	_MainTex ("Base (RGBA)", 2D) = "white" {TexGen EyeLinear }
    	_Tint("Tint", Color)=(1,1,1,1)
    	//_RefTex ("Reflection",2D) ="white" {TexGen CubeReflect}
    }
    SubShader {
    	
    	Tags {"Queue" = "Transparent+3"}
    	
        Pass {
        	Blend SrcAlpha OneMinusSrcAlpha	
            Material {
                Diffuse [_Color]
                Ambient[_Ambient]
            }
            Lighting On
            SetTexture[_Base]
            {
            	constantColor[_Tint]
            	combine texture*constant , texture*constant
            }
            SetTexture[_MainTex]
            {
            	combine texture*previous,previous
            }
          
        }
    }
} 