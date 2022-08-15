import Emitter from 'tiny-emitter';
export const emitter = new Emitter();

/**
 *
 * name: buffer_loaded
 * description: inform when audioBuffer is created and loaded from the decodeAudioData
 *
 * emitters:
 * AudioManager loadAudio
 *
 * listeners:
 * AudioPlayer.vue
 *
 */
