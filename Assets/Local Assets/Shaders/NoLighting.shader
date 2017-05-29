Shader "NoLighting" 
{
	
    Properties 
    {
          _MainTex ("Base (RGBA)", 2D) = "white" { }
          
         
          
    }
    SubShader
     { 
        Pass {
  	
        	
            SetTexture[_MainTex]
            	{
            		
            		
            		
          		}
          	 }
            
        
     }
}