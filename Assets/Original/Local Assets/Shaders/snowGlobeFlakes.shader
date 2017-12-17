Shader "SnowGlobeFlakes" {
    Properties {
    	_Color ("Main Color", Color) = (1,1,1,1)
    	_MainTex ("Base (RGBA)", 2D) = "white" { }
    	 
    }
    SubShader {
    	Tags { "Queue" = "Transparent+20" }
    	
        Pass {
        	
            Material {
                Diffuse [_Color]
                Ambient[_Color]
            }
            
            Lighting On
            Blend SrcAlpha OneMinusSrcAlpha
            SetTexture[_MainTex]
            {
            	combine texture*primary DOUBLE, texture
            }
          
        }
    }
} 