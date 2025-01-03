// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | 'obtener-productos' | 'actualizar-producto' | 'eliminar-producto' | 'obtener-presentaciones' | 'agregar-producto';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

// Exponer nuevo manejador para NeDB
const dbHandler = {
  obtenerProductos: async (): Promise<any[]> => {
    return await ipcRenderer.invoke('obtener-productos');
  },
  obtenerPresentaciones: async (): Promise<any[]> => {
    return await ipcRenderer.invoke('obtener-presentaciones');
  },
  actualizarProducto: async (id: string, datos: object): Promise<boolean> => {
    return await ipcRenderer.invoke('actualizar-producto', id, datos);
  },
  eliminarProducto: async (id: string): Promise<boolean> => {
    return await ipcRenderer.invoke('eliminar-producto', id);
  },
  agregarProducto: async (datos: object): Promise<any> => {
    return await ipcRenderer.invoke('agregar-producto', datos);
  },
};

// Combinar ambos manejadores
contextBridge.exposeInMainWorld('electron', { ...electronHandler, dbHandler });

export type ElectronHandler = typeof electronHandler & {
  dbHandler: typeof dbHandler;
};
