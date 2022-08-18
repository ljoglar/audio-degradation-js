import Emitter from 'tiny-emitter';
export const emitter = new Emitter();

/**
 *
 * name: audioLoaded
 * description: inform when the audio is loaded and the audioBuffer created
 *
 * emitters:
 * AudioManager loadAudio
 *
 * listeners:
 * AudioPlayer.vue
 *
 */

/**
 *
 * name: audioLoaded
 * description: inform when the audio is loaded and the audioBuffer created
 *
 * emitters:
 * AudioManager loadAudio
 *
 * listeners:
 * AudioPlayer.vue
 *
 */

/**
 *
 * name: gainVolumeChange
 * description: inform when there is a change in the slider of the volume
 *
 * emitters:
 * AudioPlayer.vue updateGainValue
 *
 * listeners:
 * AudioManager
 *
 */

/**
 *
 * name: degradationParamChange
 * description: inform when there is a change in the slider of the harmonic distortion
 *
 * emitters:
 * AudioPlayer.vue updateDegradation
 *
 * listeners:
 * AudioManager
 *
 */
