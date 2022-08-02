
class normaliseAudio extends DegradationBase{
    constructor(audio, fs, max_amplitude = 0.999) {
        super(audio, fs);
        this.max_amplitude = max_amplitude;
    }

    execute(){
        if (this.audio !== null) {
            const maxValueInAudio = Math.max(Math.max(Math.max(Math.abs(this.audio))));
            this.audio.forEach((channel) => {
                this.audioOut.push(channel.map((sample) => this.max_amplitude * sample / maxValueInAudio, MIN_VALUE));
            });

            /*
            let lengthAudio = length(this.audio[0]);
            for (var i = 0; i < lengthAudio; i++ ){
                this.audioOut[0].append(this.max_amplitude * this.audio[0][i] / maxValueInAudio, MIN_VALUE));
                this.audioOut[1].append(this.max_amplitude * this.audio[1][i] / maxValueInAudio, MIN_VALUE));
            }
            */
        }
    }
}