import { describe, it, expect } from 'vitest';
import { BhashiniService } from './bhashiniService';

describe('BhashiniService - Speech & Multilingual Bridge', () => {
  it('translates MoSPI domain technical terms using fallback dictionary', async () => {
    const textEn = 'View your readiness index on the dashboard';
    const translated = await BhashiniService.translate(textEn, 'en', 'hi');

    expect(translated).toBeDefined();
    expect(translated).toContain('तैयारी सूचकांक');
    expect(translated).toContain('डैशबोर्ड');
  });

  it('returns original text when source and target language are identical', async () => {
    const text = 'Urban Frame Survey Block';
    const result = await BhashiniService.translate(text, 'en', 'en');
    expect(result).toBe(text);
  });

  it('simulates ASR speech transcription in fallback mode without crashing', async () => {
    const dummyBlob = new Blob(['mock-audio'], { type: 'audio/wav' });
    const transcript = await BhashiniService.asr(dummyBlob, 'hi');
    expect(transcript).toBeDefined();
    expect(typeof transcript).toBe('string');
    expect(transcript.length).toBeGreaterThan(3);
  });

  it('handles TTS synthesis gracefully in non-browser/test environment', async () => {
    const result = await BhashiniService.synthesize('Schedule 0.0 boundary verification', 'en');
    // In Node.js/Vitest, window.speechSynthesis is undefined so returns null
    expect(result === null || typeof result === 'string').toBe(true);
  });
});
