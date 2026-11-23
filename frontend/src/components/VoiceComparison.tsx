import { useEffect, useRef, useState } from 'react';
import type { UseRecorderReturn } from '../hooks/useRecorder';
import type { ProsodyResult } from '../api/types';
import { request, phoneticsAudioUrl } from '../api/client';
import { ProsodyPanel } from './ProsodyPanel';
import { MicrophoneControls } from './MicrophoneControls';

type Result = ProsodyResult & {recording: NonNullable<ProsodyResult['recording']> & {rms_dbfs:number}};
export function VoiceComparison({recorder,lessonId,word}:{recorder:UseRecorderReturn;lessonId:string;word:string}) {
  const [result,setResult] = useState<Result>();
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  const version = useRef(0);
  useEffect(()=>{version.current++;setResult(undefined);setPending(false);setError('');return ()=>{version.current++;};},[recorder.audioBlob,lessonId]);
  async function analyze() {
    if (!recorder.audioBlob || pending) return;
    const token = version.current;
    setPending(true);setError('');
    const body = new FormData();
    body.append('audio_file',recorder.audioBlob,'recording.webm');
    try { const value = await request<Result>('/phonetics/voice/'+lessonId,{method:'POST',body});
      if (token===version.current) setResult(value);
    } catch(e) {if(token===version.current)setError(e instanceof Error ? e.message : 'Could not analyse recording. Please try again.');}
    finally {if(token===version.current)setPending(false);}
  }
  return <section className="space-y-3" aria-label="Voice comparison">
    <h3 className="text-xl">Test your microphone and compare your voice</h3>
    <p>Say “{word}” once, leaving a brief pause before and after. Check your input level while recording and listen to your take before comparing.</p>
    <MicrophoneControls recorder={recorder}/>
    <button className="primary-button" disabled={pending || ['requesting_permission','stopping'].includes(recorder.state)} onClick={recorder.isRecording ? recorder.stopRecording : recorder.startRecording}>
      {recorder.isRecording ? 'Stop recording' : recorder.audioUrl ? 'Record another take' : 'Record my voice'}</button>
    {recorder.errorMessage && <p role="alert">{recorder.errorMessage}</p>}
    {recorder.audioUrl && <><div className="space-y-2"><label className="block">British example · synthetic voice<audio aria-label="Reference example" controls src={phoneticsAudioUrl('/audio/'+lessonId)} className="w-full"/></label><label className="block">Your recording<audio aria-label="Your recording" controls src={recorder.audioUrl} className="w-full"/></label></div>
      <button className="secondary-button" disabled={pending || recorder.isRecording} onClick={analyze}>{pending ? 'Analysing…' : 'Analyse and compare with example'}</button></>}
    {error && <p role="alert">{error}</p>}
    {result && <><p role="status">{result.recording.rms_dbfs < -45 ? 'The recording level is very low. Move closer to the microphone or select another input and try again.' : (result.recording.clipped_ratio || 0) >= .01 ? 'The audio signal is clipping. Lower your input gain or move slightly back from the microphone.' : result.status==='unscorable' ? 'Not enough steady speech was detected. Listen to your take, check your input and try again.' : 'Comparison ready. Listen to both takes and review the contours below.'}</p>
      <p className="text-sm">Your recording level: {result.recording.rms_dbfs} dBFS. Reference: synthetic British voice from this lesson.</p>
      <ProsodyPanel result={result}/>
    </>}
    <p className="text-xs text-text-muted">Compares duration, relative pitch and voice signal. Grading individual phonemes requires validated phonetic assessment. Takes are processed locally on this machine and are not stored in lab history.</p>
  </section>;
}
