Shader "Metal" {
    Properties {
    	_Ambient ("Ambient", Color) = (0,0,0,1)
    	_Color ("Main Color", Color) = (1,1,1,1)
    	_Specular ("Specular", Color) = (1,1,1,1)
    	_Shininess ("Shininess", Range (0.01, 1)) = 0.7
    	_MainTex ("Base (RGBA)", 2D) = "white" { }
    }
    SubShader {
    	Tags { "Queue" = "Geometry+20" }
    	
        Pass {
        	
            Material {
            	Ambient[_Ambient]
                Diffuse [_Color]
                
                 Shininess [_Shininess]
                Specular[_Specular]
            }
            Lighting On
            SetTexture[_MainTex]
            {
            	combine texture*primary DOUBLE, texture
            }
          
        }
    }
} 