/**
 * Created by yan on 2018/6/15.
 */
define([], function () {
    return {
        /**天地图矢量*/
        tdtsl: new Cesium.WebMapTileServiceImageryProvider({
            // url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            url: "https://t2.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=94736dde140b2268c3f28b38c954f758",
            layer: "tdtVecBasicLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: true
        }),
        tdtsl_zj: new Cesium.WebMapTileServiceImageryProvider({
            url: "https://t0.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=94736dde140b2268c3f28b38c954f758",
            layer: "tdtAnnoLayer",
            style: "default",
            format: "image/jpeg",
            tileMatrixSetID: "GoogleMapsCompatible",
            show: false
        }),
        /**
         * 天地图影像
         */
        tdtyx: new Cesium.WebMapTileServiceImageryProvider({
            // url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles",
            url:'https://t0.tianditu.gov.cn/img_w/wmts?tk=e5986705c2e63faa4db36aca1db7b34c',
            layer: 'img',
            style: 'default',
            format: 'tiles',
            tileMatrixSetID: 'w',
            // credit:new Cesium.Credit('天地图全球影响'),
            maximumLevel:18,
            show: false
        }),
        // tdtyx: new Cesium.WebMapTileServiceImageryProvider({
        //     url: "http://t0.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=e5986705c2e63faa4db36aca1db7b34c",
        //     layer: "tdtBasicLayer",
        //     style: "default",
        //     format: "image/jpeg",
        //     tileMatrixSetID: "GoogleMapsCompatible",
        //     show: true

        // }),
        tdtyx_zj: new Cesium.WebMapTileServiceImageryProvider({
            // url: "http://t0.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=e5986705c2e63faa4db36aca1db7b34c",
            url: "http://t0.tianditu.gov.cn/cia_w/wmts?tk=e5986705c2e63faa4db36aca1db7b34c",
            layer: "img",
            style: "default",
            format: "tiles",
            tileMatrixSetID: "w",
            show: false
        }),
        
         /**
         * arcgis影像
         */
        esriImageryProvider : new Cesium.ArcGisMapServerImageryProvider({
            url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
         })
    }
});