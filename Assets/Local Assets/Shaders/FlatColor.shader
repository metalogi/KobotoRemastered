Shader "FlatColor" 
{
	
    Properties 
    {
          _Color ("Base", Color) =(1,1,1,1)
          
         
          
    }
    SubShader
     { 
          	
        	
        Pass {
        	
        	Color [_Color]
  	
            
          	 }
          	 
            
        
     }
}