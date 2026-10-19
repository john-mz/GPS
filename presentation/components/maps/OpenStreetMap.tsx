import { useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
interface LatLng { latitude: number; longitude: number; }

interface Point extends LatLng { title: string; description?: string; }
interface Props {
  center: LatLng;
  markers?: Point[];
  staticMode?: boolean;
  onReady?: () => void;
  onUserPan?: () => void;
}
// La capa OpenStreetMap se carga en una WebView. Leaflet controla mapa y marcadores.
// En producción use un proveedor de teselas adecuado al volumen de usuarios.
export default function OpenStreetMap({ center, markers = [], staticMode = false, onReady, onUserPan }: Props) {
  const webRef = useRef<WebView>(null);
  const html = useMemo(() => `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/><style>html,body,#map{height:100%;width:100%;margin:0;padding:0} .leaflet-control-attribution{font-size:10px!important}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>
(function(){const map=L.map('map',{dragging:${!staticMode},touchZoom:${!staticMode},scrollWheelZoom:false,doubleClickZoom:${!staticMode},boxZoom:false,keyboard:${!staticMode},zoomControl:${!staticMode}}).setView(${JSON.stringify([center.latitude,center.longitude])},${staticMode?12:16});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
const userMarker=L.circleMarker(${JSON.stringify([center.latitude,center.longitude])},{radius:9,color:'#1857c9',weight:3,fillColor:'#3485ff',fillOpacity:0.9}).addTo(map).bindPopup('Centro seleccionado del mapa');
${JSON.stringify(markers)}.forEach(p=>{const el=document.createElement('div');el.textContent=p.title;const description=p.description||'';L.marker([p.latitude,p.longitude]).addTo(map).bindPopup(el.outerHTML+'<p>'+description.replace(/</g,'&lt;')+'</p>');});
map.on('dragstart',()=>window.ReactNativeWebView?.postMessage('pan'));
window.moveTo=(lat,lng)=>{userMarker.setLatLng([lat,lng]);map.setView([lat,lng],16,{animate:true});};
window.updateUser=(lat,lng)=>userMarker.setLatLng([lat,lng]);
window.ReactNativeWebView?.postMessage('ready');})();
</script></body></html>`, [center.latitude, center.longitude, markers, staticMode]);
  return <View style={styles.container}><WebView ref={webRef} originWhitelist={['*']} source={{ html, baseUrl: 'https://localhost/' }} javaScriptEnabled domStorageEnabled style={styles.container} onMessage={(e)=>{if(e.nativeEvent.data==='ready')onReady?.();if(e.nativeEvent.data==='pan')onUserPan?.();}} />
  </View>;
}
const styles=StyleSheet.create({container:{flex:1}});
