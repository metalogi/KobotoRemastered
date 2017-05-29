Shader "Basic" {
    Properties {
    	_Color ("Main Color", Color) = (1,1,1,1)
    	_MainTex ("Base (RGBA)", 2D) = "white" { }
    }
    SubShader {
        Pass {
        	
            Material {
                Diffuse [_Color]
            }
            Lighting On
            SetTexture[_MainTex]
            {
            	combine texture*primary DOUBLE, texture
            }
          
        }
    }
} 