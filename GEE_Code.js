
var gns = ee.FeatureCollection('projects/cloudtostreet/Hiring/Remote_Sensing_Scientist/RSSTestGNs');
var hrsl = ee.Image('projects/cloudtostreet/Hiring/Remote_Sensing_Scientist/RSSTestHRSL');
var perm = ee.Image('projects/cloudtostreet/Hiring/Remote_Sensing_Scientist/RSSTestPermWater');

//Map.addLayer(gns);
//Map.addLayer(hrsl);
//Map.addLayer(perm);



// Load the image from the archive.
var image = ee.Image('COPERNICUS/S1_GRD/S1A_IW_GRDH_1SDV_20171209T001649_20171209T001719_019618_021540_4C29').clip(gns)
Map.setCenter(81.26,6.28, 11)
Map.addLayer(image.select('VV'),{min:-30,max:0},'SAR from Sentilel1c');


// Mask Out Water Bodies
// Load or import the Hansen et al. forest change dataset.
var hansenImage = ee.Image('UMD/hansen/global_forest_change_2018_v1_6').clip(gns);
// Select the permanent water mask.
var datamask = hansenImage.select('datamask');
// Create a binary mask.
var mask = datamask.eq(1);
// Update the composite mask with the water mask.
var image = image.updateMask(mask);
//Map.addLayer(image,{min:-30,max:0})



// Filter Speckle noise
//var imageBefore = imageBefore.focal_median(25, 'circle', 'meters')
var image = image.focal_median(30, 'circle', 'meters')

// Mask Seasonal Water
var mask02 = image.select('VV').gt(-16);
var image = image.updateMask(mask02);
//Map.addLayer(image,{min:-30,max:0})



// Compute the histogram of the Image
var histogram = image.select('VV').reduceRegion({
  reducer: ee.Reducer.histogram(255, 2)
      .combine('mean', null, true)
      .combine('variance', null, true), 
  geometry: gns, 
  scale: 30,
  bestEffort: true
});
// Chart the histogram
print(Chart.image.histogram(image.select('VV'), gns, 30));

// Otsu Algorithm
var otsu = function(histogram) {
  var counts = ee.Array(ee.Dictionary(histogram).get('histogram'));
  var means = ee.Array(ee.Dictionary(histogram).get('bucketMeans'));
  var size = means.length().get([0]);
  var total = counts.reduce(ee.Reducer.sum(), [0]).get([0]);
  var sum = means.multiply(counts).reduce(ee.Reducer.sum(), [0]).get([0]);
  var mean = sum.divide(total);
  
  var indices = ee.List.sequence(1, size);
  
  // Compute between sum of squares, where each mean partitions the data.
  var bss = indices.map(function(i) {
    var aCounts = counts.slice(0, 0, i);
    var aCount = aCounts.reduce(ee.Reducer.sum(), [0]).get([0]);
    var aMeans = means.slice(0, 0, i);
    var aMean = aMeans.multiply(aCounts)
        .reduce(ee.Reducer.sum(), [0]).get([0])
        .divide(aCount);
    var bCount = total.subtract(aCount);
    var bMean = sum.subtract(aCount.multiply(aMean)).divide(bCount);
    return aCount.multiply(aMean.subtract(mean).pow(2)).add(
           bCount.multiply(bMean.subtract(mean).pow(2)));
  });
  print(ui.Chart.array.values(ee.Array(bss), 0, means));
  // Return the mean value corresponding to the maximum BSS.
  return means.sort(bss).get([-1]);
};

var threshold = otsu(histogram.get('VV_histogram'));
print('threshold', threshold);

// Classify the Image
var classA = image.select('VV').lt(threshold);
Map.addLayer(classA.mask(classA), {palette: 'blue'}, 'Flood');

//Visual Inspection with RGB images on Flood Date
var rgbVis = {
  min: 0.0,
  max: 0.3*10000,
  bands: ['B4', 'B3', 'B2'],
};

var dataset = ee.ImageCollection('COPERNICUS/S2')
                  .filterBounds(gns)
                  .filterDate('2017-12-09', '2017-12-10');
Map.addLayer(dataset.mosaic().clip(gns), rgbVis, 'RGB',0);

//Affected Pop Calculation
// Calculate total Pop per feature
var scale = hrsl.projection().nominalScale()
var districtSums = hrsl.reduceRegions({
  collection: gns,
  reducer: ee.Reducer.sum(),
  scale: scale,
});
print(districtSums)
//Map.addLayer(districtSums)

// Calculate Affected Pop per feature
var Affectedpop=hrsl.multiply(classA)
var scale = Affectedpop.projection().nominalScale()
var districtSums02 = Affectedpop.reduceRegions({
  collection: gns,
  reducer: ee.Reducer.sum(),
  scale: scale,
});
//Map.addLayer(districtSums02)


// Visualization of Affected Pop

var palettes = require('users/gena/packages:palettes')
var style = require('users/gena/packages:style')
var utils = require('users/gena/packages:utils')

var min = 0;
var max = 250;

// Paired
var palette = palettes.colorbrewer.Paired[6]
var textProperties = { fontSize:16, textColor: '000000', outlineColor: 'ffffff', outlineWidth: 2, outlineOpacity: 0.6 }

// add a gradient bar
var labels = ee.List.sequence(min, max, 60)
var gradient = style.GradientBar.draw(geometryGradientBar, {
  min: min, max: max, palette: palette, labels: labels, format: '%.0f', text: textProperties
})
Map.addLayer(gradient, {}, 'gradient bar (DEM)')

// add a scale bar
var scale = style.ScaleBar.draw(geometryScaleBar, {
  steps:4, palette: ['5ab4ac', 'f5f5f5'], multiplier: 1000, format: '%.1f', units: 'km', text: textProperties
})
Map.addLayer(scale, {}, 'scale bar')


var empty = ee.Image().byte();  
//var palette = ['0000FF', '00FF00', 'FF0000'];
var filledOutlines = empty.paint(districtSums02, 'sum').paint(districtSums02, 0, 2);
Map.addLayer(filledOutlines, {palette: ['000000'].concat(palette), max: 200, opacity:0.7}, 'Affected People');  


Export.image.toDrive({
  image: classA,
  description: 'FloodMap',
  scale: 30,
  region: hrsl
});


// Export the FeatureCollection.
Export.table.toDrive({
  collection: districtSums02,
  description: 'AffectedPop',
  fileFormat: 'CSV'
});

