import { remote } from 'electron';

import { Client } from '../../rpc';

const MODE = remote.getGlobal('process').env ? remote.getGlobal('process').env.NODE_ENV : 'prod';

let client;

if (MODE === 'dev') {
  const { rpcusername: user, rpcpassword: pass } = require('../dev-config.json');

  client = new Client({
    user,
    pass,
  });
  remote.getGlobal('sharedObj').state = '100';
} else {
  client = new Client({
    user: remote.getGlobal('sharedObj').user,
    pass: remote.getGlobal('sharedObj').pass,
  });
}

export default client;
