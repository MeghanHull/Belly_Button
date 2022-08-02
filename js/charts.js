// RICE-VIRT-DATA-PT-05-2022-U-B-MW Module 12 Challenge
// ----------------------------------------------------------------------------------------------------------
// 1. Reads data from "samples.json"
// 2. Need to open GitBash & enter:
//      python -m http.server
//    When reading an external data file such as a CSV or JSON file into a script, you must run a server. 
//    You cannot directly open index.html with your browser
//    REFERENCE : Module 12.3.2
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
  // Call data from samples.json
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
// 1. Create the buildCharts function.
function buildCharts(sampleID2) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json(inputJSON).then((data) => {
    // 3. Create a variable that holds the samples array.
    var allSamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = allSamples.filter(sampleObj => sampleObj.id == sampleID2);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleArray[0];
    console.log(firstSample)
    
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids;
    var otuLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;
    console.log(otuIds) 
    console.log(otuLabels)
    console.log("sampleValues:")
    console.log(sampleValues)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0,10).map(id => "OTU " + id).reverse();
    console.log("yticks:")
    console.log(yticks)
    
    // 8. Create the trace for the bar chart.
    var sampleTopValues = sampleValues.slice(0,10).reverse();
    var sampleTopLabels = otuLabels.slice(0,10).reverse(); 
    var barData = [{
      x: sampleTopValues,
      text: otuLabels.slice(0,10).reverse(),
      type: "bar"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        tickmode: "array",
        tickvals: [0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  });
}
