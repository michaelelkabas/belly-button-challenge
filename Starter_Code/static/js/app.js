// Function to build the metadata panel
function buildMetadata(sampledata) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // Get the metadata field
        const metadata = data.metadata;
        
        // Filter the metadata for the object with the desired sample number
        const dataArray = metadata.filter(sampledataObj => sampledataObj.id == sampledata);
        const result = dataArray[0];
        
        // Use d3 to select the panel with id of `#sample-metadata`
        const PANEL = d3.select("#sample-metadata");
     
        // Use `.html("")` to clear any existing metadata
        PANEL.html("");
        
        // Inside a loop, use d3 to append new tags for each key-value pair in the filtered metadata
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

// Function to build the charts
function buildCharts(sampledata) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // Get the samples field
        const samples = data.samples;
        
        // Filter the samples for the object with the desired sample number
        const dataArray = samples.filter(sampledataObj => sampledataObj.id == sampledata);
        const result = dataArray[0];
        
        // Get the otu_ids, otu_labels, and sample_values
        const otu_ids = result.otu_ids;
        const otu_labels = result.otu_labels;
        const sample_values = result.sample_values;
       
        // Build a Bubble Chart
        const bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };
                
        const bubbleLayout = {
            title: "Bacterial Cultures Per Sample",
            margin: { t: 0 },
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30 }
        };
        
        Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

        // For the Bar Chart, map the otu_ids to a list of strings for your yticks
        const yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        
        // Build a Bar Chart
        const barTrace = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
        const barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            xaxis: { title: "Number of Bacteria" },
            margin: { t: 30, l: 150 }
        };

        Plotly.newPlot("bar", [barTrace], barLayout);
    });
}

// Function to initialize the dashboard
function init() {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // Get the names field
        const sampleNames = data.names;
        
        // Use d3 to select the dropdown with id of `#selDataset`
        const dropdown = d3.select("#selDataset");
        
        // Use the list of sample names to populate the select options
        sampleNames.forEach(name => {
            dropdown.append("option").text(name).property("value", name);
        });
        
        // Get the first sample from the list
        const initialSample = sampleNames[0];
      
        // Build charts and metadata panel with the first sample
        buildMetadata(initialSample);
        buildCharts(initialSample);
    });
}

// Function for event listener
function optionChanged(newSample) {
    // Build charts and metadata panel each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Initialize the dashboard
init();
