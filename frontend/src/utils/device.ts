export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type Capabilities = {
  input?: 'touch' | 'mouse' | 'hybrid';
  connection?: 'slow' | 'fast' | 'unknown';
  dpr?: number | undefined;
};

const mobileRegex = /(Android|iPhone|iPod|Windows Phone|BlackBerry|BB10)/i;
const tabletRegex = /(iPad|Tablet|PlayBook|Nexus 7|Nexus 9|SM-T|Galaxy Tab)/i;

/**
 * Pure device classification based on a user-agent string.
 * Keep this function deterministic and free of DOM references so it's safe on the server.
 */
export function getDeviceType(userAgent?: string | null): DeviceType {
  const ua = (userAgent || '').trim();
  if (!ua) return 'desktop'; // safe default

  if (tabletRegex.test(ua)) return 'tablet';
  if (mobileRegex.test(ua)) return 'mobile';
  return 'desktop';
}

/**
 * Infer runtime capabilities.
 * - On the server, pass only userAgent and leave browser-specific fields undefined.
 * - On the client, pass navigator (or leave undefined to auto-detect inside).
 */
export function getCapabilities(
  userAgent?: string | null,
  clientNavigator?: Navigator | null
): Capabilities {
  const device = getDeviceType(userAgent);

  // connection
  let connection: Capabilities['connection'] = 'unknown';
  try {
    // navigator.connection may exist in browser

    const navConn = (clientNavigator as any)?.connection;
    if (navConn && typeof navConn.effectiveType === 'string') {
      const slowTypes = ['slow-2g', '2g', '3g'];
      connection = slowTypes.includes(navConn.effectiveType) ? 'slow' : 'fast';
    }
  } catch (e) {
    connection = 'unknown';
    console.warn('Error detecting connection type:', e);
  }

  // input detection (coarse)
  let input: Capabilities['input'];
  if (clientNavigator) {
    // client-side preference: pointer media query
    try {
      if (
        (window?.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
        device === 'mobile'
      ) {
        input = 'touch';
      } else {
        input = 'mouse';
      }
      // hybrid is possible on many tablets; keep it simple: if tablet -> hybrid
      if (device === 'tablet') input = 'hybrid';
    } catch (e) {
      input = device === 'mobile' ? 'touch' : 'mouse';
      console.warn('Error detecting input type:', e);
    }
  } else {
    // server-side guess: mobile -> touch, tablet -> hybrid, desktop -> mouse
    input = device === 'mobile' ? 'touch' : device === 'tablet' ? 'hybrid' : 'mouse';
  }

  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : undefined;

  return { input, connection, dpr };
}
