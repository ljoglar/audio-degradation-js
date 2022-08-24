import {emitter} from "../emitter";
import audioConfig from "./audio_config.js"

class AudioManager {
    constructor(audioContext, audioURL) {
        this.audioContext = audioContext;
        this.audioURL = audioURL;
        this.audioSource = null;
        this.currentTime = 0;
        this.loadAudio();
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
            await this.connectDegradationPipelines();
        }
    }

    async connectDegradationPipelines() {
        Object.entries(this.degradationObject).forEach(entry => {
            const [degradation, attrs] = entry;
            attrs.gainNode.connect(this.audioContext.destination);
            attrs.gainNode.gain.value = 0.4;
            if (typeof attrs.processorUrl !== 'undefined') {
                attrs.audioWorklet.addModule(attrs.processorUrl, {}).then(() => {
                    attrs.degradationNode = new AudioWorkletNode(this.audioContext, degradation + 'Processor');
                    attrs.gainNode.connect(attrs.degradationNode).connect(this.audioContext.destination);
                });
            }
        });
    }

    playOrPause(state, degradationName) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (state === true) {
            this.degradationObject[degradationName].audioSource = this.audioContext.createBufferSource();
            this.degradationObject[degradationName].audioSource.buffer = this.audioBuffer;
            this.degradationObject[degradationName].audioSource.connect(this.degradationObject[degradationName].gainNode);
            let startAt = 0;
            if ( this.degradationObject[degradationName].times.pausedAt !== 0){
                startAt = this.degradationObject[degradationName].times.pausedAt;
            }
            this.degradationObject[degradationName].audioSource.start(this.audioContext.currentTime, startAt);
            this.degradationObject[degradationName].times.playedAt = this.audioContext.currentTime;
        } else if (state === false) {
            this.degradationObject[degradationName].time = this.audioContext.currentTime;
            this.degradationObject[degradationName].audioSource.stop();
            this.degradationObject[degradationName].times.pausedAt = this.degradationObject[degradationName].times.pausedAt +
                this.audioContext.currentTime - this.degradationObject[degradationName].times.playedAt;
        }
    }

    stop(degradationName) {
        this.degradationObject[degradationName].time = this.audioContext.currentTime;
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
        const harmonicDistParam = this.degradationObject[degradationName].degradationNode.parameters.get(this.degradationObject[degradationName].processorParam);
        harmonicDistParam.setValueAtTime(value, this.audioContext.currentTime);
    }
}

export default AudioManager;
