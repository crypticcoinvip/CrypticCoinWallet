import electronStore from 'electron-store';

const CCCacheStore = new electronStore({
  encryptionKey: Buffer.from('crypticcoincurrency'),
});

export default CCCacheStore;
