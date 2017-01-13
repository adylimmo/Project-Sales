// Kelas untuk mendapatkan data Assignment dari server
// Author Riko Logwirno
class ComSendCoord {

    // Parameter default untuk koneksi ke restAPI
    restURL = "http://202.158.39.170/salesforce/public/api/trackings";
    resource = "";
    sendMethod = "GET";
    sendHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    sendData = "";

    // Nothing for now
    constructor(){
    }

    // Setter
    setRestURL(restURL) {
        this.restURL = restURL;
    }
    setResource(resource) {
        this.resource = resource;
    }
    setMethod(sendMethod) {
        this.sendMethod = sendMethod;
    }
    setHeadersAccept(sendHeadersAccept) {
        this.sendHeaders.Accept = sendHeadersAccept;
    }
    setHeadersContentType(sendHeadersContentType) {
        this.sendHeaders['Content-Type'] = sendHeadersContentType;
    }
    setSendData(sendData) {
        this.sendData = JSON.stringify(sendData);
    }
    setParams(){
        params = {};
        params["method"] = this.sendMethod;
        params["headers"] = this.sendHeaders;
        if (this.sendMethod !== "GET") {
            params["body"] = this.sendData;
        }
        return params;
    }

    // Ambil assigment
    sendCoord(callback) {
        fetch(this.restURL + this.resource, this.setParams())
        .then((response) => response.json())
        .then((responseJson) => {
            callback(responseJson);
        });
    }
}

export default new ComSendCoord
