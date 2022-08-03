// RICE-VIRT-DATA-PT-05-2022-U-B-MW Module 12 Challenge
// ----------------------------------------------------------------------------------------------------------
// Purpose  : Dynamicly build table and charts from JS data file
// Created  : 2022 Aug 02 19:49:12 UTC (Meghan E. Hull)
// Modified : 2022 Aug 03 01:51:25 UTC (Meghan E. Hull)
// ----------------------------------------------------------------------------------------------------------// 1. Reads data from "samples.json"
// 1. Reads data from "samples.json"
// 2. For local QA, need to open GitBash & enter:
//      python -m http.server
//    When reading an external data file such as a CSV or JSON file into a script, you must run a server. 
//    You cannot directly open index.html with your browser.
// ----------------------------------------------------------------------------------------------------------
// Confirm JS is called
console.log('charts.js loaded')
var inputJSON = "js/samples.json";

// ----------------------------------------------------------------------------------------------------------
// Triggers
// ----------------------------------------------------------------------------------------------------------
// Initialize the dashboard
init();

// ----------------------------------------------------------------------------------------------------------
// Functions
// ----------------------------------------------------------------------------------------------------------
function init() {
// Purpose: Dynamic creation of dropdown menu
  // Select dropdown menu
  var selector = d3.select("#selDataset");
  // Read data from samples.json
  d3.json(inputJSON).then((data) => {
      // Confirm data is pulled correctly
      console.log(data);
      // Pull array of participant IDs
      var sampleNames = data.names;
      // Add each ID to the dropdown menu "selector"
      sampleNames.forEach((sample) => {
          selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      // Use the first sample from the list to build the initial plots
      var firstSampleID=sampleNames[0];
      buildCharts(firstSampleID);
      buildMetadata(firstSampleID);
  });
}
function optionChanged(newSampleID) {
// Purpose: When dropdown selection is changed, call functions to build metadata & charts 
  // Log sample ID
  console.log(newSampleID);
  // Call functions to build content for panel
  buildMetadata(newSampleID);
  buildCharts(newSampleID);
}
function buildMetadata(sampleID) {
// Purpose: Build Demographics Panel 
  // Call data from input json
  d3.json(inputJSON).then((data) => {
    // Save metadata for all participants
    var metadata = data.metadata;
    // Find metadata for selected participant ID
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleID);
    var result = resultArray[0];
    console.log(result)
    // Select Dynamic Sample Metadata Panel
    var PANEL = d3.select("#sample-metadata");
    // Clear panel
    PANEL.html("");
    /// Use `Object.entries` to add each key and value pair to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}
function buildCharts(sampleID2) {
// Purpose: Builds charts "bar" and "bubble"
  // Call data from input json 
  d3.json(inputJSON).then((data) => {
    // D0. Search for selected participant data 
    // - Save samples array for all participants
    var allSamples = data.samples;
    // - Find samples for selected participant ID
    var sampleArray = allSamples.filter(sampleObj => sampleObj.id == sampleID2);
    var firstSample = sampleArray[0];
    console.log(firstSample)
    // - Save the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // D1. Create bar chart
    // - Slice top 10 bacteria for bar chart
    var noBarPlot = 10
    var totalValues = sampleValues.length;
    if (totalValues < noBarPlot) { var noBarPlot = totalValues };
    if (noBarPlot == 1) { var pluralText = ""} else {var pluralText = "s"};
    var sampleTopValues = sampleValues.slice(0,noBarPlot).reverse();
    var sampleTopLabels = otuLabels.slice(0,noBarPlot).reverse(); 
    var yticks = otuIds.slice(0,noBarPlot).map(id => "OTU " + id).reverse();
    var yvals = Array.from({length:noBarPlot}, (v, i) => i);
    // - Create bar chart trace
    var barData = [{
      x: sampleTopValues,
      text: sampleTopLabels,
      type: "bar"
    }];
    // - Create bar chart layout 
    var barLayout = {
      title: {
        text:"<b>Top Bacteria Cultures Found</b><br>" + noBarPlot + " of " + totalValues + " culture" + pluralText
      },
      yaxis: {
        tickmode: "array",
        tickvals: yvals,
        ticktext: yticks
      },
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: -0.25,
        yanchor: 'center',
        text: "The " + noBarPlot + " most numerous bacterial species (OTUs)<br>from the participant's belly button",
        showarrow: false
      }]
    };
    // - Plot the bar chart 
    Plotly.newPlot("bar", barData, barLayout, {responsive: true});

    // D2. Create bubble chart
    // - Create bubble chart trace
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    }];
    // - Create bubble chart layout
    var bubbleLayout = {
      title: "<b>Bacteria Cultures per Sample</b><br>"  + totalValues + " culture" + pluralText,
      xaxis: {title: "OTU ID"}
    };
    // - Plot the bubble chart 
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //D3. Create gauge
    // - Find the washing frequency
    var allMetadata = data.metadata.filter(sampleObj => sampleObj.id == sampleID2);
    var washFreq = +allMetadata[0].wfreq;
    // - Create gauge trace
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: washFreq,
      gauge: {
        axis: {
          range: [null,10],
          tickmode: "array",
          tickvals: [0,2,4,6,8,10],
          ticktext: [0,2,4,6,8,10]
        },
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: 'red'},
          {range: [2,4], color: 'orange'},
          {range: [4,6], color: 'yellow'},
          {range: [6,8], color: 'lime'},
          {range: [8,10], color: 'green'}
        ]
      }
    }];
    // - Create gauge layout
    var gaugeLayout = { 
      // autosize: true,
      title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
      annotations: [{
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 0,
        yanchor: 'center',
        text: "The gauge displays participant's belly button weekly washing frequency",
        showarrow: false
      }]
    };
    // - Plot gauge
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  });
}
