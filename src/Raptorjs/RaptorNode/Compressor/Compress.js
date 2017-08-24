"use strict"
var Compressor=require('raptorjs').Compressor;

class Compress extends Compressor{
	/**
	*
	*
	*/
	run(R,compressor){

		this.compressBackbone(true);

		

	}

}

module.exports=Compress;