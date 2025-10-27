import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const customApi = {
  generatePDF: (payload: { html: string; defaultFilename?: string }) =>
    ipcRenderer.invoke('generate-pdf', payload),
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', {
      ...electronAPI,
      ...customApi,
    });

    contextBridge.exposeInMainWorld('api', {
    });
  } catch (error) {
    console.error('preload expose error', error);
  }
} else {
  // @ts-ignore
  window.electronAPI = { ...electronAPI, ...customApi };
  // @ts-ignore
  window.api = {};
}
