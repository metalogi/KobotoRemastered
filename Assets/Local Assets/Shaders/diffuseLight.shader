Shader "DiffuseAmb" {
    Properties {
    	_Color ("Main Color", Color) = (1,1,1,1)
    	_Ambient ("Ambient Color", Color) = (1,1,1,1)
    	_MainTex ("Base (RGBA)", 2D) = "white" { }
    }
    SubShader {
    	
    	
        Pass {
        	
            Material {
                Diffuse [_Color]
                Ambient[_Ambient]
            }
            Lighting On
            SetTexture[_MainTex]
            {
            	combine texture*primary QUAD, texture
            }
          
        }
    }
} 