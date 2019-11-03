/**
 * Created by admin on 2018/6/19.
 */
define([], function () {
    return {
        buttonClickHandler: function (obj) {
            var options = {
                camera : viewer.scene.camera,
                canvas : viewer.scene.canvas
            };
            if(obj){
                Sandcastle.addToolbarMenu([{
                    text : 'KML - Global Science Facilities',
                    onselect : function() {
                        viewer.camera.flyHome(0);
                        viewer.dataSources.add(Cesium.KmlDataSource.load('./Cesium/kml/facilities/facilities.kml', options));
                    }
                }, {
                    text : 'KMZ with embedded data - GDP per capita',
                    onselect : function() {
                        viewer.camera.flyHome(0);
                        viewer.dataSources.add(Cesium.KmlDataSource.load('../../SampleData/kml/gdpPerCapita2008.kmz', options));
                    }
                }], 'toolbar');
                Sandcastle.reset = function() {
                    viewer.dataSources.removeAll();
                    viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
                    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
                };
            }else{
                debugger
                viewer.dataSources.removeAll();
                document.getElementById('toolbar').innerHTML = '';
            }


        }
    };

});

