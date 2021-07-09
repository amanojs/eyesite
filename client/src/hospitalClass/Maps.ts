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
    const center = { lat: position.lat, lng: position.lng };
    this.map = new google.maps.Map(this.divMap, {
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center,
      zoom: 18
    });
    const marker = new google.maps.Marker({
      // マーカーの追加
      position: center, // マーカーを立てる位置を指定
      map: this.map // マーカーを立てる地図を指定
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

  move(address_data: string): void {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      {
        address: address_data
      },
      (results, status) => {
        if (status == 'OK' && results![0].geometry?.location !== undefined) {
          const { lat, lng } = results![0].geometry.location;
          this.initMap({ lat: lat(), lng: lng() });
        }
      }
    );
  }
}
