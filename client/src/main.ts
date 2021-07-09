import './style.css';
import { GoogleLoader } from './modules/GoogleLoader';
import { Maps } from './hospitalClass/Maps';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello EyeSite!</h1>
`;

/**  div id = mapをhtmlから取得 */
const divMap = document.querySelector<HTMLDivElement>('#map');

/** 病院検索で受け取ったオブジェクトを格納するための変数 */
let hos_data: google.maps.places.PlaceResult[] | null;

// 住所の格納場所の親要素取得
const hospital_box = document.querySelector<HTMLDivElement>('#hospital_box');

/** Mapsクラスを実体化 */
const maps = new Maps(divMap);

GoogleLoader.load().then(async () => {
  /** 位置情報をもとに座標を取得 */
  const result = await maps.getLatLng();
  console.log(result);
  /** 地図表示＆病院検索 */
  maps.initMap(result);
  /** 検索 */
  hos_data = await maps.getHosdata(result);
  console.log(hos_data);

  // html表示
  if (hos_data) {
    // 取得した病院データの数だけ繰り返す
    for (let i = 0; i < hos_data?.length; i++) {
      const elem = document.createElement('div');
      // 生成されたHTML要素がクリックされた時の処理
      elem.onclick = () => {
        if (hos_data) {
          moveMap(hos_data[i].formatted_address || 'undefind');
        }
      };
      // id
      elem.id = 'hos_address' + i;
      // テキスト内容
      const hospital_address = hos_data[i].formatted_address;
      if (hospital_address) {
        elem.innerHTML = hospital_address;
        hospital_box?.appendChild(elem);
      }
    }
  }
});

/** 地図移動 */
function moveMap(address: string) {
  console.log('address:', address);
  GoogleLoader.load().then(() => {
    maps.move(address);
  });
}
