import { useState } from 'react';

const checks = [
  { question:'What does ˈ indicate in /bəˈnɑːnə/?', choices:['The following syllable carries primary stress','The preceding vowel is long'], correct:0, lesson:'primary', tip:'The stress mark precedes the prominent syllable: NA in banana.' },
  { question:'When moving from fan to van, what changes primarily?', choices:['The point of contact','Vocal fold vibration (voicing)'], correct:1, lesson:'v', tip:'Keep the upper incisors near the lower lip and add voicing for /v/.' },
  { question:'What happens during the vowel in light?', choices:['The tongue glides towards a closer, front position','The tongue remains in a fixed position'], correct:0, lesson:'price', tip:'The movement of /aɪ/ happens smoothly within a single syllable.' },
];

export function PhoneticsReference({disabled,onPractice}:{disabled:boolean;onPractice:(id:string)=>void}) {
  const [answers,setAnswers] = useState<Record<number,number>>({});
  return <details className="rounded-panel border border-border p-4"><summary className="cursor-pointer font-semibold">Reference guide and initial diagnostic</summary>
    <div className="mt-4 space-y-4 text-sm">
      <section><h3>E1 · Reading the chart</h3><p>Slashes indicate phonemes: /ʃ/ is the opening sound in ship. Square brackets show phonetic realisation: [pʰ] includes the burst of air in pin. ˈ and ˌ precede the stressed syllable; ː follows a long vowel.</p></section>
      <section><h3>E2 · Find a starting point</h3><p>These three quick checks help orient your conceptual practice; they do not grade your voice.</p>
        {checks.map((c,i)=><div key={c.lesson} className="mt-3"><p>{c.question}</p><div className="flex flex-wrap gap-2 my-1">{c.choices.map((s,j)=><button key={s} className="secondary-button" aria-pressed={answers[i]===j} onClick={()=>setAnswers(a=>({...a,[i]:j}))}>{s}</button>)}</div>
          {answers[i]!==undefined && <p role="status">{answers[i]===c.correct ? 'Correct. ' : 'Note this: '}{c.tip} <button className="quiet-button" disabled={disabled} onClick={()=>onPractice(c.lesson)}>Open lesson</button></p>}</div>)}</section>
      <section><h3>E3 · Common interference patterns</h3><p>If ship and sheep sound identical to you, alternate both lessons and listen closely to vowel quality as well as length. If you tend to insert a vowel before stop clusters, hold /s/ cleanly first and link smoothly into /t/. Focus only on contrasts you notice in your own speech.</p></section>
      <section><h3>E4 · Contrasts and regional variation</h3><p>This chart uses Southern Standard British English as its baseline. NEAR, SQUARE, and CURE vary widely across speakers; a traditional transcription does not force every speaker to produce the same glide. You can also consult the <a className="underline" href="https://www.internationalphoneticassociation.org/content/ipa-chart" target="_blank" rel="noreferrer">International Phonetic Association chart</a> to locate symbols.</p></section>
      <section><h3>E5 · Spelling and sound</h3><p>The spelling ea sounds completely different in sea and head. Conversely, see and sea share the exact same pronunciation in this variety. Always check the whole word before generalising a spelling rule.</p></section>
      <section><h3>E6 · Glossary · edition 1</h3><dl><dt>Minimal pair</dt><dd>Two words distinguished by a single phoneme, such as fan and van.</dd><dt>Voicing</dt><dd>Vibration of the vocal folds during articulation.</dd><dt>Lexical stress</dt><dd>Relative prominence of a syllable within a word.</dd><dt>Intonation</dt><dd>Movement of vocal pitch across an utterance.</dd></dl></section>
    </div></details>;
}
