'use strict';

module.exports = class Logger
{
    #parent; #metadata; #streams = [];

    constructor()
    {
        
    }

    pipe( stream )
    {
        this.#parent ? this.#parent.pipe( stream ) : this.#streams.push( stream );

        return this;
    }

    meta( metadata )
    {
        let logger = new Logger();

        logger.#parent = this;
        logger.#metadata = metadata;

        return logger;
    }

    #log( level, metadata, ...data )
    {
        if( this.#metadata && metadata )
        {
            metadata = { ...this.#metadata, ...metadata };
        }

        if( this.#parent )
        {
            this.#parent.#log( level, metadata, ...data );
        }
        else
        {
            let log = { level, timestamp: Date.now(), meta: metadata, data };

            for( let stream of this.#streams )
            {
                ( !stream.filter || stream.filter( log )) && stream.log( log );
            }
        }
    }

    emergency	( ...data ){ this.#log( 0, undefined, ...data ); } // system is unusable
	alert		( ...data ){ this.#log( 1, undefined, ...data ); } // action must be taken immediately
	critical	( ...data ){ this.#log( 2, undefined, ...data ); } // critical conditions
	error		( ...data ){ this.#log( 3, undefined, ...data ); } // error conditions
	warning		( ...data ){ this.#log( 4, undefined, ...data ); } // warning conditions
	notice		( ...data ){ this.#log( 5, undefined, ...data ); } // normal but significant condition
	info		( ...data ){ this.#log( 6, undefined, ...data ); } // informational messages
	debug		( ...data ){ this.#log( 7, undefined, ...data ); } // debug-level messages
	devel		( ...data ){ this.#log( 8, undefined, ...data ); } // development messages
}