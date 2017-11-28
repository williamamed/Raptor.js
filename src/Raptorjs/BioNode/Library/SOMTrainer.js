'use strict';

/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class SOMTrainer {

	constructor(som){
		this.som=som;

		var max=[]
		var min=[]
		for (var i = 0; i < som.inputs; i++) {
			max.push(0.5)
			min.push(-0.5)
		};
		this.min_vec=min;
		this.max_vec=max;
		this.iteration=0;

	}

	fill(index,cant,value){
		var list=new Array(cant)
		for (var i = index; i <cant; i++) {
			list[i]=value;
		};
		return list;
	}

	learningRate(){
		return Math.max(0.1, 1 - (this.iteration * 0.001));
	}

	neighborhoodRate(distance){
	    if (distance < 0 || distance > 1)
	      throw new Error("Distance must be between 0 and 1");
	//    return cos($distance * 1.6) * $this->learningRate();
	    var radius = this.searchRadius();
	    return Math.exp(-6.666666667 * (distance / radius)) * this.learningRate();
	 }

	searchRadius(){
    	return Math.max(4, Math.max(this.som.width, this.som.height) * 2 / 3);
    }


    move(i, j, dvec, rate){
	    for (var k = 0; k < this.som.inputs; k++){
	    	
	      this.som.grid[i][j][k] += (dvec[k]- this.som.grid[i][j][k]) * rate;
	    }
    }


    setLimits(min, max){
	    if (typeof min!='array')
	      min = this.fill(0, this.som.inputs, min);
	    if (typeof min!='array')
	      max = this.fill(0, this.som.inputs, max);

	    this.min_vec = min;
	    this.max_vec = max;
    }

  	train(vec){
	    this.iteration++;

	    var grid = this.som.grid;
	    var radius = this.searchRadius();

	    var bmu_c = this.som.getBMUCoord(vec);
	    var bmu = this.som.grid[bmu_c[0]][bmu_c[1]];
	    
	    var max_i = Math.min(this.som.width, bmu_c[0] + radius);
	    var max_j = Math.min(this.som.height, bmu_c[1] + radius);

	    for (var i = Math.max(0, bmu_c[0] - radius); i < max_i; i++)
	    {
	      for (var j = Math.max(0, bmu_c[1] - radius); j < max_j; j++)
	      {
	      	
	        if (i == bmu_c[0] && j == bmu_c[1])
	          this.move(i, j, vec, this.neighborhoodRate(0));
	        else{
	          var di = bmu_c[0] - i;
	          var dj = bmu_c[1] - j;
	          var distance = Math.sqrt((di * di) + (dj * dj));
	          if (distance < radius)
	            this.move(Math.floor(i), Math.floor(j), vec, this.neighborhoodRate(distance / radius));
	        }
	      }
	    }
  	}

}

module.exports=SOMTrainer;