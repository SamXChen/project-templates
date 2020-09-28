import store from 'test-app-client/spa-modules/test-app/js/store';

import * as React from 'react';
import * as Server from 'react-dom/server';
import MainContainer from 'test-app-client/spa-modules/test-app/js/containers/main';


function render() {
    const str = Server.renderToString(
        <MainContainer />
    );
    return str;
}

export default render;
export { store };