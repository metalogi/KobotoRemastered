Shader "DiffuseAmbTransRef2" {
    Properties {
    	_Color ("Main Color", Color) = (1,1,1,1)
    	_Ambient ("Ambient Color", Color) = (1,1,1,1)
    	_MainTex ("Base (RGBA)", 2D) = "white" {}
    	_RefTex ("Reflection",2D) ="white" {TexGen CubeReflect}
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
            SetTexture[_MainTex]
            {
            	combine texture*primary QUAD, texture
            }
              SetTexture[_RefTex]
            {
            	combine texture*previous DOUBLE, previous
            }
          
        }
    }
} 