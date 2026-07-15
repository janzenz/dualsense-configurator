import type { ControllerType } from './pricing';

export const SONY_VENDOR_ID = 0x054c;
export const DS5_PRODUCT_ID = 0x0ce6;
export const DS5_EDGE_PRODUCT_ID = 0x0df2;

export const BOARD_MODELS = ['BDM-010', 'BDM-020', 'BDM-030', 'BDM-040', 'BDM-050', 'BDM-060'];

export function hwToBoardModel(hwinfo: number): string {
  const a = (hwinfo >> 8) & 0xff;
  if (a === 0x03) return 'BDM-010';
  if (a === 0x04) return 'BDM-020';
  if (a === 0x05) return 'BDM-030';
  if (a === 0x06) return 'BDM-040';
  if (a === 0x07 || a === 0x08) return 'BDM-050';
  if (a === 0x11) return 'BDM-060M';
  if (a === 0x13) return 'BDM-060X';
  return 'Unknown';
}

export function isWebHidSupported(): boolean {
  return typeof navigator !== 'undefined' && 'hid' in navigator;
}

export interface DetectedController {
  type: ControllerType;
  board: string;
}

export async function detectController(): Promise<DetectedController | null> {
  const filters = [
    { vendorId: SONY_VENDOR_ID, productId: DS5_PRODUCT_ID },
    { vendorId: SONY_VENDOR_ID, productId: DS5_EDGE_PRODUCT_ID },
  ];

  let devices = await navigator.hid.getDevices();
  devices = devices.filter((d) => d.vendorId === SONY_VENDOR_ID && (d.productId === DS5_PRODUCT_ID || d.productId === DS5_EDGE_PRODUCT_ID));
  if (devices.length === 0) {
    devices = await navigator.hid.requestDevice({ filters });
  }
  if (devices.length === 0) {
    return null;
  }

  const [device] = devices;
  if (device.opened) {
    await device.close();
  }
  await device.open();

  try {
    const view = await device.receiveFeatureReport(0x20);
    if (view.getUint8(0) !== 0x20 || view.byteLength !== 64) {
      throw new Error('Unexpected response from controller — try again.');
    }

    const hwinfo = view.getUint32(24, true);
    const board = hwToBoardModel(hwinfo);
    const type: ControllerType = device.productId === DS5_EDGE_PRODUCT_ID ? 'edge' : 'dualsense';

    return { type, board };
  } finally {
    await device.close();
  }
}
