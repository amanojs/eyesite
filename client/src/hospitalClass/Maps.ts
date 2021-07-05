import { divMap, hos_data } from '../main';

export class Maps {
  map: google.maps.Map | null;

  constructor() {
    this.map = null;
  }

  /** 座標取得処理 */
  getLatLng(): Promise<{ lat: number; lng: number }> {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        resolve({ lat, lng });
      });
    });
  }

  /** マップ表示処理 */
  initMap(position: { lat: number; lng: number }): void {
    if (!divMap) return;
    this.map = new google.maps.Map(divMap, {
      center: { lat: position.lat, lng: position.lng },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 18
    });

    /** 病院検索 */
    const hosPlace = new google.maps.places.PlacesService(this.map);
    hosPlace.textSearch(
      {
        location: new google.maps.LatLng(position.lat, position.lng),
        radius: 100000,
        query: '眼科'
      },
      function (result, status) {
        console.log(result);
        if (!result) return;
      }
    );
  }
}
