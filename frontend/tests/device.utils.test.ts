import { getDeviceType } from '../src/utils/device';

describe('Device Detection Utility', () => {
    describe('getDeviceType', () => {
        it('detects mobile devices', () => {
            const mobileUAs = [
                'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
                'Mozilla/5.0 (Linux; Android 10; SM-G960U)',
                'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 640 XL LTE)',
            ];
            mobileUAs.forEach(ua => {
                expect(getDeviceType(ua)).toBe('mobile');
            });
        });

        it('detects tablet devices', () => {
            const tabletUAs = [
                'Mozilla/5.0 (iPad; CPU OS 13_2 like Mac OS X)',
                'Mozilla/5.0 (Linux; Android 9; SM-T860)',
                'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML, like Gecko) Version/7.2.1.0 Safari/536.2+',
            ];
            tabletUAs.forEach(ua => {
                expect(getDeviceType(ua)).toBe('tablet');
            });
        });

        it('defaults to desktop for empty or unknown UAs', () => {
            const desktopUAs = [
                '',
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
                'UnknownBot/1.0',
            ];
            desktopUAs.forEach(ua => {
                expect(getDeviceType(ua)).toBe('desktop');
            });
        });
    });
});
