import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import type { DeviceType, Capabilities } from '../utils/device';
import { getDeviceType, getCapabilities } from '../utils/device';

type DeviceState = {
  deviceType: DeviceType;
  capabilities: Capabilities;
  // expose a stable flag for server-derived origin
  isServerDerived: boolean;
};

const DeviceContext = createContext<DeviceState | undefined>(undefined);

declare global {
  interface Window {
    __INITIAL_DEVICE__?: DeviceType;
  }
}

export const DeviceProvider: React.FC<{
  children: React.ReactNode;
  initialDevice?: DeviceType;
}> = ({ children, initialDevice }) => {
  // initialDevice typically injected by server: window.__INITIAL_DEVICE__ or via props
  const serverDevice: DeviceType | undefined =
    initialDevice ??
    (typeof window !== 'undefined'
      ? window.__INITIAL_DEVICE__ // server injection pattern
      : undefined);

  // compute initial capabilities conservatively
  const initialCapabilities = getCapabilities(
    serverDevice ?? undefined,
    typeof navigator !== 'undefined' ? navigator : undefined
  );

  const [state] = useState<DeviceState>(() => ({
    deviceType:
      serverDevice ??
      (typeof navigator !== 'undefined' ? getDeviceType(navigator.userAgent) : 'desktop'),
    capabilities: initialCapabilities,
    isServerDerived: !!serverDevice,
  }));

  // Optionally: on mount, we can enrich capabilities (but do not change deviceType)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // refine capabilities (network, pointer, dpr) — but do NOT flip deviceType
    // const refinedCaps = getCapabilities(undefined, navigator);
    // since we want an immutable "deviceType", only update capabilities
    // We leave this placeholder here as per the architecture plan.
    // If dynamic capability updates are needed (e.g. network change), we would add a separate effect here.
  }, []);

  // Expose a stable, memoized object
  const value = useMemo(() => state, [state]); // state is immutable, so this stays stable

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useDevice(): DeviceState {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error('useDevice must be used within a DeviceProvider');
  return ctx;
}
