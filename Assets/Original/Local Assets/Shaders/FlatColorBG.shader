Shader "FlatColorBG" 
{
	
    Properties 
    {
          _Color ("Base", Color) =(1,1,1,1)
          
         
          
    }
    SubShader
     { Tags { "Queue" = "Background" }
          	
        	
        Pass {
        	
        	Color [_Color]
  	
            
          	 }
          	 
            
        
     }
}