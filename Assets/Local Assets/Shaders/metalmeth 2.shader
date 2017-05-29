Shader "MetalRef" {
    Properties {
    	_Ambient ("Ambient", Color) = (0,0,0,1)
    	_Color ("Main Color",2D) = "white" {}
    	_Specular ("Specular", Color) = (1,1,1,1)
    	_Shininess ("Shininess", Range (0.01, 1)) = 0.7
    	
    	_RefTex ("Base (RGBA)", 2D) = "white" {TexGen EyeLinear}
    }
    SubShader {
    	Lighting On
    	
        Pass {
      	//	BindChannels {
  // Bind "Vertex", vertex
  // Bind "texcoord", texcoord0
  // Bind "texcoord1", texcoord1
//
//} 
            Material {
            	Ambient[_Ambient]
                Diffuse [_Color]
                
                 Shininess [_Shininess]
                Specular[_Specular]
            }
            
            SetTexture[_Color]
            {
            	combine texture*primary QUAD
            }
        
        	SetTexture[_RefTex]
        	{
        		combine texture*previous 
        	}
          
        }
    }
} 