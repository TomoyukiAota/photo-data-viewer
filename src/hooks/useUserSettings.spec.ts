import { changeSendUsageData } from './useUserSettings';

describe('changeSendUsageData', () => {
  function run(send: boolean): string[] {
    const steps: string[] = [];
    changeSendUsageData(send, {
      track: (value) => steps.push(`track ${value}`),
      save: (value) => steps.push(`save ${value}`),
    });
    return steps;
  }

  it('records turning it off before it takes effect, so that the change is sent', () => {
    expect(run(false)).toEqual(['track false', 'save false']);
  });

  it('records turning it on after it takes effect, so that the change is sent', () => {
    expect(run(true)).toEqual(['save true', 'track true']);
  });
});
