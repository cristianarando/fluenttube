import type { UseRecorderReturn } from '../hooks/useRecorder';
import { RefreshCw } from 'lucide-react';

export function MicrophoneControls({recorder,compact=false}:{recorder:UseRecorderReturn;compact?:boolean}) {
  const busy = ['recording','stopping','requesting_permission'].includes(recorder.state);
  return <div className={compact ? 'microphone-compact rounded border border-border p-2 text-xs' : 'space-y-2 rounded border border-border p-3 text-sm'}>
    <label className="block">Microphone
      <select className="block w-full bg-surface p-2 mt-1" value={recorder.deviceId || ''} disabled={busy} onChange={e=>recorder.setDeviceId(e.target.value)}>
        <option value="">System default</option>
        {(recorder.devices || []).map((d,i)=><option key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone '+(i+1)}</option>)}
      </select></label>
    <button className="quiet-button" title="Refresh microphones" aria-label="Refresh microphones" disabled={busy} onClick={()=>void recorder.refreshDevices()}>{compact ? <RefreshCw size={14}/> : 'Refresh microphones'}</button>
    {!compact && <p className="text-xs text-text-muted">{recorder.activeMicrophone ? 'Last active input: '+recorder.activeMicrophone : 'Allow microphone access when recording to see device names.'}</p>}
    {recorder.isRecording && <><label className="block">Input level <meter aria-label="Microphone input level" min="0" max="1" value={recorder.inputLevel || 0} className="w-full"/></label>
      <p role="status">Recording · {recorder.durationSeconds.toFixed(1)} s · {(recorder.inputLevel || 0) > .02 ? 'Signal detected' : 'Low input level: speak closer to the microphone or check your selected input.'}</p></>}
  </div>;
}
