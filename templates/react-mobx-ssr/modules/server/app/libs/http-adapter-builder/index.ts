import Adapter from 'http-adapter/dist/server';

import buildApis from '../http-apis';

let adapter: Adapter;

export default function buildAdapter(config: any) {
    if (adapter === undefined) {
        adapter = new Adapter();
        adapter.setApis(buildApis(config));

        adapter.setHeaderHook(header => {
            console.log('============================= header =============================');
            console.log('header:', header);
            console.log('=========================== header end ===========================');
            return header;
        });

        adapter.setOptionHook(option => {

          console.log('============================= option =============================');
          console.log(option);
          console.log('=========================== option end ===========================');
          return option;
        });

        adapter.setResHook((error, response, body) => {
          if (error) {
            console.log('============================= error =============================');
            console.log(error);
            console.log('=========================== error end ===========================');
            return { error, response, body };
          }
          if (body) {
            console.log('============================= body =============================');
            console.log(body);
            console.log('=========================== body end ===========================');
            const { code, data, message } = body;
            if (code !== 0) {
              const newError: any = {};
              newError.code = code;
              newError.message = message;
              return { error: newError, response: null, body: null };
            } else {
              return {
                error,
                response,
                body: data,
              };
            }
          }
          return { error, response, body };
        });
    }

    return adapter;
}
