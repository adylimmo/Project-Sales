// Kelas untuk pengambilan locasi posisi device dengan gps/location
// Note :
//  - Fitur watchCurrentPosition belum di ujicoba
// Author Riko Logwirno
class ComGeolocation {

    watchID: ?number = null;

    // Ambil posisi sekarang
    currentPosition(callback) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                callback(position);
            },
            (error) => {
                console.log("errorCurrentPosition: ",error);
                let data = {};
                data.coords = {latitude: 'error', longitude: 'error'};
                callback(data);
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
        );
    }

    // Ambil posisi pergerakan secara realtime
    watchCurrentPosition(callback){
        navigator.geolocation.watchPosition(
            (position) => {
                callback(position);
            },
            (error) => {
                console.log("errorWatch: ",error);
                let data = {};
                data.coords = {latitude: 'error', longitude: 'error'};
                callback(data);
            },
            {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
        );
    }

    // Matikan pengambilan posisi pergerkan secara realtime
    clearWatchCurrentPosition(){
        navigator.geolocation.clearWatch(this.watchID);
    }

}

export default new ComGeolocation();
