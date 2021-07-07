export class Maps {
  map: google.maps.Map | null;
  hos_data: google.maps.places.PlaceResult[] | null;
  divMap: HTMLDivElement | null;

  constructor(divMap: HTMLDivElement | null) {
    this.map = null;
    this.hos_data = null;
    this.divMap = divMap;
  }

  /** 座標取得処理
   * @returns 緯度経度
   */
  async getLatLng(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        resolve({ lat, lng });
      });
    });
  }

  /** マップ表示処理
   * @param 緯度経度
   */
  initMap(position: { lat: number; lng: number }): void {
    if (!this.divMap) return;
    this.map = new google.maps.Map(this.divMap, {
      center: { lat: position.lat, lng: position.lng },
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 18
    });
  }

  /**
   *病院情報検索
   * @param 緯度経度
   * @returns 病院情報のオブジェクト
   */
  async getHosdata(position: { lat: number; lng: number }): Promise<google.maps.places.PlaceResult[] | null> {
    if (!this.map) return null;
    const hosPlace = new google.maps.places.PlacesService(this.map);
    return new Promise((resolve) => {
      hosPlace.textSearch(
        {
          location: new google.maps.LatLng(position.lat, position.lng),
          radius: 1000,
          query: '眼科'
        },
        (result) => {
          console.log(result);
          resolve(result);
        }
      );
    });
  }
}
