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
const hospital_box = document.querySelector<HTMLDivElement>('#hospital_box');

/** Mapsクラスを実体化 */
const maps = new Maps(divMap);

GoogleLoader.load().then(async () => {
  /** 位置情報をもとに座標を取得 */
  const result = await maps.getLatLng();
  console.log(result);
  /** 地図表示＆病院検索 */
  await GoogleLoader.load().then(() => {
    maps.initMap(result);
  });
  /** 検索 */
  await GoogleLoader.load().then(async () => {
    hos_data = await maps.getHosdata(result);
    console.log(hos_data);

    // html表示
    if (hos_data) {
      for (let i = 0; i < hos_data?.length; i++) {
        console.log('a');
        const elem = document.createElement('div');
        const br = document.createElement('br');
        // id
        elem.id = 'hos_address' + i;
        // テキスト内容
        elem.innerHTML = hos_data[i].formatted_address;
        hospital_box?.appendChild(elem);
        hospital_box?.appendChild(br);
      }
    }
  });
});
