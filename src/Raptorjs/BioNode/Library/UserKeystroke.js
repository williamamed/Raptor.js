'use strict';
var SOM=require('./SOM')
var SOMTrainer=require('./SOMTrainer')
/*
* Raptor.js - Node framework
* Controlador ES6
* 
*
*/
class UserKeystroke {

	constructor(){
		this.inicialized = false;
        this.rawSampleSize = 0;
        this.digraphSize = 0;
        this.trigraphSize = 0;
        this.trained = false;

        this.umbral=0;
        this.lastscore=0;
        this.samples=[];
        //this.addSamples(samples);
	}

	addSample(sample) {

        if (this.rawSampleSize == 0) {
            this.rawSampleSize = sample.length;
            this.digraphSize = this.rawSampleSize - 1;
            this.trigraphSize = this.rawSampleSize - 2;
        }
        
        if (this.rawSampleSize != 0 && this.rawSampleSize != sample.length)
            throw new Error("KDynamics Error, the sample size it's different to the others.");
        if (this.samples.length == 20)
            this.samples.shift();
        this.samples.push(sample);
    }

    addSamples(samples) {
        if (samples.length == 0)
            throw new Error("KDynamics Error, the samples cannot be zero.");

        for (var sample in samples) {
            this.addSample(samples[sample]);
        }

        if (!this.inicialized) {
            this.som = new SOM(20, 20, this.digraphSize + this.trigraphSize);
            this.inicialized = true;
        }

        return this.rawSampleSize;
    }



    train(sample) {

        var trainer = new SOMTrainer(this.som);
        trainer.setLimits(0, 10000);
        var train = false;

        var mean = 0;
        if (!this.trained) {
        	for (var i = 0; i < this.samples.length; i++) {
            	var sampleItem=this.samples[i]
            	var key=i;
                //Create de digraph and trigraph
                var meanRest = 0;
                for (var j = 0; j < this.samples.length; j++) {
                	var value=this.samples[j]
            		var key2=j;
                
                    if (key != key2) {
                        meanRest+= this.som.distance(this.getDigraph(sampleItem).concat(this.getTrigraph(sampleItem)),this.getDigraph(value).concat(this.getTrigraph(value)));
                    }
                }
                mean+=(meanRest / (this.samples.length - 1));
                train = true;
                this.trained = true;
                trainer.train(this.getDigraph(sampleItem).concat(this.getTrigraph(sampleItem)));
            }
            if (this.trained) {
                mean = mean / this.samples.length;
                this.umbral=mean;
            }
        }
        if (sample && sample.length > 0 && sample.length == this.rawSampleSize) {
            this.addSample(sample);
            //Create de digraph and trigraph
            train = true;
            trainer.train(this.getDigraph(sample).concat(this.getTrigraph(sample)));
            mean = 0;
           for (var i = 0; i < this.samples.length; i++) {
            	var sampleItem=this.samples[i]
            	var key=i;
                //Create de digraph and trigraph
                var meanRest = 0;
                for (var j = 0; j < this.samples.length; j++) {
                	var value=this.samples[j]
            		var key2=j;
                    if (key != key2) {
                        meanRest+= this.som.distance(this.getDigraph(sampleItem).concat(this.getTrigraph(sampleItem)),this.getDigraph(value).concat(this.getTrigraph(value)));
                    }
                }
                mean+=(meanRest / (this.samples.length - 1));
            }
            this.umbral = mean / this.samples.length;
        }
        return train;
    }


    getDigraph(sample) {
        var digraph = [];
        if (sample.length > 0 && sample.length == this.rawSampleSize) {
            for (var index = 1; index < sample.length; index++) {
                digraph.push(sample[index].up - sample[index-1].up);
            }
        }
        return digraph;
    }
	
	getTrigraph(sample) {
        var trigraph = [];
        if (sample.length > 0 && sample.length == this.rawSampleSize) {
            for (var index = 2; index < sample.length; index++) {
                trigraph.push((sample[index].up - sample[index - 1].up) + (sample[index - 1].up - sample[index - 2].up))
            }
        }
        return trigraph;
    }

    testSample(sample) {
        /**
        var origVector = this.getDigraph(sample).concat(this.getTrigraph(sample))
        var bmuCoord =  this.som.getBMUCoord(origVector);
        var bmu =  this.som.getBMU(origVector);
        var dist=this.som.getSimilarityMap(bmuCoord[0],bmuCoord[1]);

        var distance=this.som.distance(origVector, bmu)
        console.log(dist,'>=',distance, dist >= distance,'distance')
        if(dist >= distance)
                return true;
            else
                return false;*/
        /**
        var origVector = this.getDigraph(sample).concat(this.getTrigraph(sample))
        var bmu =  this.som.getBMU(origVector);
        var best=this.som.get10BMU();

        var dist=0;
        for (var i = 0; i < best.length; i++) {
            var newVec=best[i];
            var p=this.som.distance(this.som.grid[0][0],newVec);
            dist+=p
        };
        dist=dist/best.length
        var distance=this.som.distance(origVector, bmu)
        console.log(dist,'>=',distance, dist >= distance,'distance prom')
        if(dist >= distance)
                return true;
            else
                return false;
        */        
        
        if(this.rawSampleSize ==  sample.length){
            console.log('valid')
//            echo 'ula'.$this->rawSampleSize.' - '.count($sample);
            var origVector = this.getDigraph(sample).concat(this.getTrigraph(sample))
            var vector =  this.som.getBMU(origVector);
            var distance =  this.som.distance(origVector, vector);
            this.lastscore = distance;
             console.log(distance ,this.umbral,'distance')
            if(distance < this.umbral)
                return true;
            else
                return false;
        }  else {
            console.log(this.rawSampleSize , sample.length,'invalid')
//            echo 'lalala'.$this->rawSampleSize.' - '.count($sample);
            return false;
        }
    }

    setData(data){
        this.inicialized= data.inicialized
        this.rawSampleSize= data.rawSampleSize
        this.digraphSize= data.digraphSize
        this.trigraphSize= data.trigraphSize
        this.trained= data.trained
        this.umbral= data.umbral
        this.lastscore= data.lastscore
        this.samples= data.samples
        this.som=new SOM(data.somWidth,data.somHeight,data.somInputs)
        this.som.grid=data.somGrid
    }

    getData(){
        return {
            inicialized: this.inicialized,
            rawSampleSize: this.rawSampleSize,
            digraphSize: this.digraphSize,
            trigraphSize: this.trigraphSize,
            trained: this.trained,
            umbral: this.umbral,
            lastscore: this.lastscore,
            samples: this.samples,
            somWidth: this.som.width,
            somHeight: this.som.height, 
            somInputs: this.som.inputs,
            somGrid: this.som.grid
        }
    }
}

module.exports=UserKeystroke;