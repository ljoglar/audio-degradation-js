import {emitter} from "../emitter";
import audioConfig from "./audio_config.js"
import AudioDegradation from "../../../js/audioDegradation";

class AudioManager {
    constructor(audioContext, audioURL) {
        this.audioContext = audioContext;
        this.audioURL = audioURL;
        this.audioDegradation = new AudioDegradation();
        this.audioSource = null;
        this.currentTime = 0;
        this.audioChannels = null;
        this.loadAudio();
        this.normalisationObject = {
            'normalise': true,
            'audioWorklet': this.audioContext.audioWorklet,
            'normalisationNode': null,
            'processorUrl': audioConfig.normalisation.processorUrl,
            'processorParams': ['max_amplitude']
        }
        this.degradationObject = {
            'control': {
                'audioSource': null,
                'audioWorklet': this.audioContext.audioWorklet,
                'degradationNode': null,
                'gainNode': this.audioContext.createGain(),
                'processorUrl': undefined,
                'processorParams': [],
                'times': {"playedAt": 0, "pausedAt": 0}
            },
            'harmonicDistortion': {
                'audioSource': null,
                'audioWorklet': this.audioContext.audioWorklet,
                'degradationNode': null,
                'gainNode': this.audioContext.createGain(),
                'processorUrl': audioConfig.harmonicDistortion.processorUrl,
                'processorParam': 'numApplications',
                'times': {"playedAt": 0, "pausedAt": 0}
            }
        }
    }

    async loadAudio() {
        this.audioBuffer = await this.loadAudioTrack();
        if(this.audioBuffer){
            emitter.emit('audioLoaded');
            console.log("AudioBuffer created");
            await this.createNormalisation();
            await this.connectDegradationPipelines();
            await this.getAudioData();
        }
    }

    async getAudioData(){
        this.audioChannels = Array.from({length: this.audioBuffer.numberOfChannels});
        this.audioChannels.map((channel, index) => this.audioChannels[index] = this.audioBuffer.getChannelData(index));
    }

    async createNormalisation(){
        await this.normalisationObject.audioWorklet.addModule(this.normalisationObject.processorUrl, {}).then(() => {
            this.normalisationObject.normalisationNode = new AudioWorkletNode(this.audioContext, 'normalisationProcessor');
        });
    }

    async connectDegradationPipelines() {
        Object.entries(this.degradationObject).forEach(entry => {
            const [degradation, attrs] = entry;
            attrs.gainNode.connect(this.audioContext.destination);
            attrs.gainNode.gain.value = 0.4;
            if (typeof attrs.processorUrl !== 'undefined') {
                attrs.audioWorklet.addModule(attrs.processorUrl, {}).then(() => {
                    attrs.degradationNode = new AudioWorkletNode(this.audioContext, degradation + 'Processor');
                    // attrs.gainNode.connect(attrs.degradationNode).connect(this.normalisationObject.normalisationNode).connect(this.audioContext.destination);
                    attrs.gainNode.connect(this.audioContext.destination);
                    // console.log(this.normalisationObject.normalisationNode);
                    // attrs.gainNode.connect(this.normalisationObject.normalisationNode).connect(this.audioContext.destination);
                    // if (!this.normalisationObject.normalise) {
                    //     attrs.gainNode.connect(attrs.degradationNode).connect(this.audioContext.destination);
                    // }
                });
            }
        });
    }

    playOrPause(state, degradationName) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (state === true) {
            let startAt = 0;
            if ( this.degradationObject[degradationName].times.pausedAt !== 0){
                startAt = this.degradationObject[degradationName].times.pausedAt;
            }
            this.playAudio(degradationName, startAt);
            this.degradationObject[degradationName].times.playedAt = this.audioContext.currentTime;
        } else {
            this.degradationObject[degradationName].time = this.audioContext.currentTime;
            this.degradationObject[degradationName].audioSource.stop();
            this.degradationObject[degradationName].times.pausedAt = this.degradationObject[degradationName].times.pausedAt +
                this.audioContext.currentTime - this.degradationObject[degradationName].times.playedAt;
        }
    }

    updatePosition(degradationName, state, offset) {
        this.degradationObject[degradationName].times.pausedAt = offset;
        if (state === false) {
            this.stop(degradationName);
            this.playAudio(degradationName, offset);
        }
    }

    playAudioD(audioBuffer, degradationName, offset = 0) {
        console.log(degradationName);
        this.degradationObject[degradationName].audioSource = this.audioContext.createBufferSource();
        this.degradationObject[degradationName].audioSource.buffer = audioBuffer;
        this.degradationObject[degradationName].audioSource.connect(this.degradationObject[degradationName].gainNode);
        this.degradationObject[degradationName].audioSource.start(this.audioContext.currentTime, offset);
    }

    playAudio(degradationName, offset = 0) {
        this.degradationObject[degradationName].audioSource = this.audioContext.createBufferSource();
        this.degradationObject[degradationName].audioSource.buffer = this.audioBuffer;
        this.degradationObject[degradationName].audioSource.connect(this.degradationObject[degradationName].gainNode);
        this.degradationObject[degradationName].audioSource.start(this.audioContext.currentTime, offset);
    }

    stop(degradationName) {
        this.degradationObject[degradationName].audioSource.stop();
        this.degradationObject[degradationName].times.pausedAt = 0;
    }

    async loadAudioTrack() {
        const response = await fetch(this.audioURL);
        this.arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(this.arrayBuffer);
    }

    gainVolumeChange(value, degradationName){
        this.degradationObject[degradationName].gainNode.gain.value = value;
    }

    degradationParamChange(value, degradationName){
        // const harmonicDistParam = this.degradationObject[degradationName].degradationNode.parameters.get(this.degradationObject[degradationName].processorParam);
        // harmonicDistParam.setValueAtTime(value, this.audioContext.currentTime);
        this.computeHarmonicDist(value, degradationName);
    }

    computeHarmonicDist(value, degradationName){
        console.log(this.audioChannels);
        console.log(value);
        console.log(degradationName);
        const audioComputed = this.audioDegradation.addHarmonicDistortion(this.audioChannels, 3);
        const audioNormalised = this.audioDegradation.normalise(audioComputed, 0.99);
        const arrayBuffer =  this.audioContext.createBuffer(this.audioBuffer.numberOfChannels, this.audioBuffer.length, this.audioBuffer.sampleRate);
        for (let i = 0; i < this.audioBuffer.numberOfChannels; i++){
            arrayBuffer.copyToChannel(audioNormalised[i], i);
        }
        this.playAudioD(arrayBuffer, degradationName, this.audioContext.currentTime);
    }

    // addHarmonicDistortion(){
    //     let dataHarmonicDist = this.audioDegradation.addHarmonicDistortion(3);
    //     this.audioWithHarmonicDist = this.audioContext.createBuffer(this.audioBuffer.numberOfChannels, this.audioBuffer.length, this.audioBuffer.sampleRate);
    //     for (let i = 0; i < this.audioBuffer.numberOfChannels; i++){
    //         this.audioWithHarmonicDist.copyToChannel(dataHarmonicDist[i], i);
    //     }
    //     return this.audioWithHarmonicDist;
    // }

}

export default AudioManager;
