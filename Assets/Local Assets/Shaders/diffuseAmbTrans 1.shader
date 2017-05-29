Shader "DiffuseAmbTrans1" {
    Properties {
    	_Color ("Main Color", Color) = (1,1,1,1)
    	_Ambient ("Ambient Color", Color) = (1,1,1,1)
    	_MainTex ("Base (RGBA)", 2D) = "white" { }
    }
    SubShader {
    	
    	Tags {"Queue" = "Transparent+4"}
    	
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
          
        }
    }
} 