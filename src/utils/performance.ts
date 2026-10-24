/**
 * Adaptive Performance Engine for Low-Memory & Budget Mobile Devices
 * Tailored for smartphones with 2GB RAM, Android Go, and low-tier GPUs
 */

export interface DevicePerformanceProfile {
  isLowEnd: boolean;
  deviceMemory: number | null;
  cpuCores: number;
  isMobile: boolean;
  isLowConnection: boolean;
  dpr: number;
  enableShadows: boolean;
  particleDensity: 'low' | 'medium' | 'high';
}

export function detectDeviceCapabilities(): DevicePerformanceProfile {
  if (typeof window === 'undefined') {
    return {
      isLowEnd: false,
      deviceMemory: null,
      cpuCores: 4,
      isMobile: false,
      isLowConnection: false,
      dpr: 1,
      enableShadows: true,
      particleDensity: 'high'
    };
  }

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(nav.userAgent) ||
    window.innerWidth <= 840;

  // 1. RAM check in GB (Standard Chrome Web API: 0.25, 0.5, 1, 2, 4, 8)
  const memory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory : null;
  const is2GbOrLess = memory !== null && memory <= 2;

  // 2. CPU cores check
  const cores = nav.hardwareConcurrency || 4;
  const isLowCpu = cores <= 4;

  // 3. Network & Data-saver check
  const isDataSaver = Boolean(nav.connection?.saveData);
  const isSlowNet = nav.connection?.effectiveType === '2g' || nav.connection?.effectiveType === '3g';

  // 4. URL override flags (?lite=1, ?eco=1, ?low=1)
  const urlParams = new URLSearchParams(window.location.search);
  const urlLite = urlParams.has('lite') || urlParams.has('eco') || urlParams.has('low');

  // 5. User persisted choice in localStorage
  let savedMode: string | null = null;
  try {
    savedMode = localStorage.getItem('pg_perf_mode');
  } catch {
    // ignore security/incognito restriction
  }

  const forceLow = urlLite || savedMode === 'lite';
  const isLowEnd = forceLow || is2GbOrLess || (isMobile && (isLowCpu || isDataSaver || isSlowNet));

  const dpr = isLowEnd
    ? 1
    : Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

  return {
    isLowEnd,
    deviceMemory: memory,
    cpuCores: cores,
    isMobile,
    isLowConnection: isDataSaver || isSlowNet,
    dpr,
    enableShadows: !isLowEnd && !isMobile,
    particleDensity: isLowEnd ? 'low' : (isMobile ? 'medium' : 'high')
  };
}

let cachedProfile: DevicePerformanceProfile | null = null;

export function getDeviceProfile(): DevicePerformanceProfile {
  if (!cachedProfile) {
    cachedProfile = detectDeviceCapabilities();
  }
  return cachedProfile;
}

export function isLowEndDevice(): boolean {
  return getDeviceProfile().isLowEnd;
}

export function setManualPerformanceMode(mode: 'lite' | 'full' | 'auto'): void {
  try {
    if (mode === 'auto') {
      localStorage.removeItem('pg_perf_mode');
    } else {
      localStorage.setItem('pg_perf_mode', mode);
    }
  } catch {
    // ignore
  }
  cachedProfile = null;
  window.location.reload();
}
