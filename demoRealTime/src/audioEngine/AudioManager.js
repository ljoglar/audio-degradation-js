import {emitter} from "../emitter";

class AudioManager {
    constructor(audioURL = './src/assets/audio/cello.wav') {
        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext)();
        console.log('AudioContext created');
        this.audioURL = audioURL;
        this.audioBuffer = null;
        this.audioSource = null;
        this.currentTime = 0;
        this.audioWorklet = this.audioContext.audioWorklet;
        this.gainNode = this.audioContext.createGain();
        this.harmonicDistNode = null;
        this.loadAudio();

        // update volume when slider value changes
        emitter.on("gainVolumeChange", (value) => {
            this.gainNode.gain.value = value;
        });

        // update Harmonic Distortion parameter when slider value changes
        emitter.on("degradationParamChange", (value) =>{
            const harmonicDistParam = this.harmonicDistNode.parameters.get('numApplications');
            harmonicDistParam.setValueAtTime(value, this.audioContext.currentTime);
        })
    }

    async loadAudio() {
        this.audioBuffer = await this.loadAudioTrack();
        if(this.audioBuffer){
            emitter.emit('audioLoaded');
            console.log("AudioBuffer created");
            await this.connectHarmonicDistPipeline();
        }
    }

    async connectHarmonicDistPipeline() {
        await this.audioWorklet.addModule('./src/audioEngine/harmonicDistortionProcessor.js', {}).then(() => {
            this.harmonicDistNode = new AudioWorkletNode(this.audioContext, 'harmonicDistortionProcessor');
            this.gainNode.connect(this.harmonicDistNode).connect(this.audioContext.destination);
        });
    }

    playOrPause(state) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (state === true) {
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.buffer = this.audioBuffer;
            this.audioSource.connect(this.gainNode);
            this.audioSource.start(this.currentTime);
        } else if (state === false) {
            this.currentTime = this.audioContext.currentTime;
            this.audioSource.stop();
        }
    }

    stop() {
        this.currentTime = this.audioContext.currentTime;
        this.audioSource.stop();
    }

    async loadAudioTrack() {
        const response = await fetch(this.audioURL);
        this.arrayBuffer = await response.arrayBuffer();
        return await this.audioContext.decodeAudioData(this.arrayBuffer);
    }
}

export const audioManager = new AudioManager();
