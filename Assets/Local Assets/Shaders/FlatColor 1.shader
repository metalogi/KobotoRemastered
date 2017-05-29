Shader "FlatColorAlph" 
{
	
    Properties 
    {
          _Color ("Base", Color) =(1,1,1,1)
          
         
          
    }
    SubShader
     { 
          	Tags { "Queue" = "Transparent+10" }
        	Blend SrcAlpha OneMinusSrcAlpha	
        Pass {
        	
        	Color [_Color]
  	
            
          	 }
          	 
            
        
     }
}