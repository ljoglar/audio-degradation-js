
class HarmonicDistortion extends DegradationBase {
    constructor(audio, fs, num_applications, normaliseOutput) {
        super(audio, fs);
        this.num_applications = num_applications;
        this.normaliseOutputAudio = normaliseOutput;
    }

    execute(){
        if ( this.audio !== null ) {
            this.audioOut = this.audio;
            this.audioOut.forEach((channel, index) => {
                for ( let i=0; i < this.num_applications; i++ ) {
                    channel = channel.map((sample) => Math.sin(sample * Math.PI/2 ) )
                }
                this.audioOut[index] = channel;
            });
            console.log(this.audioOut);
            /*
            let lengthAudio = length(this.audio[0]);
            for (let j = 0; j < lengthAudio; j++ ){
                this.audio_out[0].push(Math.sin(this.audio[0][j] * Math.PI/2 ));
                this.audio_out[1].push(Math.sin(this.audio[1][j] * Math.PI/2 ));
            }
            */

            // Do I really want this option here?
            if ( this.normaliseOutputAudio ) {
                normaliseAudio(this.audioOut, this.fs)
            }
        }
        return this;
    }
}