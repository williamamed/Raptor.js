'use strict';

/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class SOM {

	constructor(width, height, inputs){
		this.width=width;
		this.height=height;
		this.inputs=inputs;
		this.grid=[];

		for (var i = 0; i < width; i++) {
			var row=[]
			for (var j = 0; j < height; j++) {
				var sample=[];
				for (var k = 0; k < inputs; k++) {
					sample.push(0)
				};
				row.push(sample)
			};
			this.grid.push(row);
		};
		

	}

	distance(vec1,vec2){
		var dist=0;

		for (var i = 0; i < this.inputs; i++) {
			var v1=0
			var v2=0
			
			if(vec1&&typeof vec1[i]=='number')
				v1=vec1[i];
			if(vec2&& typeof vec2[i]=='number')
				v2=vec2[i];
			var delta=v1-v2
			//console.log(delta,vec1[i],vec2[i],'dddd')
			dist+=(delta * delta)
		};
		
		return Math.sqrt( dist ) ;
	}

	getBMU(vector){
		var unitCoord=this.getBMUCoord(vector)
		return this.grid[unitCoord[0]][unitCoord[1]]
	}

	getBMUCoord(vector){
		var shortest=Infinity;
		var bmu_x = null;
		var bmu_y = null;
		
		for (var i = 0; i < this.width; i++)
	    {
	      for (var j = 0; j < this.height; j++)
	      {
	      	
	        var distance = this.distance(this.grid[i][j], vector);

	        if ( distance < shortest )
	        {
	          shortest = distance;
	          bmu_x = i;
	          bmu_y = j;
	        }
	      }
	    }

	    return [bmu_x, bmu_y];
	}

	get10BMU(){
		var shortest=Infinity;
		var bmu_x = null;
		var bmu_y = null;
		var ten=[];
		var vector=this.grid[0][0];
		for (var i = 0; i < this.width; i++)
	    {
	      for (var j = 0; j < this.height; j++)
	      {
	      	
	        var distance = this.distance(this.grid[i][j], vector);
	        ten.push(this.grid[i][j])
	        if ( distance < shortest )
	        {
	          
	          shortest = distance;
	          bmu_x = i;
	          bmu_y = j;
	        }
	      }
	    }
	    ten.reverse()
	    return ten;
	}

	getSimilarityMap(i,j,distance){
		
		if(!distance)
			distance=20
		
		var total = 0, n = 0;

        for (var ii = -distance; ii <= distance; ii++)
        {
          for (var jj = -distance; jj <= distance; jj++)
          {
            if ((ii == 0 && jj == 0)
                || Math.sqrt((ii * ii) + (jj * jj)) > distance)
              continue;

            var ui = i + ii;
            var uj = j + jj;

            if (ui < 0 || ui >= this.width)
              continue;
            if (uj < 0 || uj >= this.height)
              continue;

            total += this.distance(this.grid[i][j],
                                           this.grid[ui][uj]);
            n++;
          }
        }

        total /= n;

        return total;
	}
}

module.exports=SOM;