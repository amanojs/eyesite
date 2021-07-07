import './style.css';
import { GoogleLoader } from './modules/GoogleLoader';
import { Maps } from './hospitalClass/Maps';

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello EyeSite!</h1>
`;

/**  div id = mapをhtmlから取得 */
const divMap = document.querySelector<HTMLDivElement>('#map');
let hos_data: google.maps.places.PlaceResult[] | null;

const maps = new Maps(divMap);
console.log('おっぱい');

GoogleLoader.load().then(async () => {
  console.log('oppai');
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
  });
});
