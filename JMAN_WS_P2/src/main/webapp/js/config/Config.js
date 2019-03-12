function _urlBase () {
    let hostname = document.location.host;
    let pathname = '/websockets/';

    return (hostname + pathname);
}

export default {
    URL_BASE: _urlBase()
}

