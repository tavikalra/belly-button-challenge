// Build the metadata panel
function buildMetadata(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // get the metadata field
        var metadata = data.metadata;

        // Filter the metadata for the object with the desired sample number
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        // Use d3 to select the panel with id of `#sample-metadata`
        var metadataPanel = d3.select("#sample-metadata");

        // Use `.html("") to clear any existing metadata
        metadataPanel.html("");

        // Inside a loop, you will need to use d3 to append new
        // tags for each key-value in the filtered metadata.
        Object.entries(result).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });

    }).catch(error => console.error("Error loading metadata:", error));
}

// function to build both charts
function buildCharts(sample) {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // Get the samples field
        var samples = data.samples;

        // Filter the samples for the object with the desired sample number
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];

        // Get the otu_ids, otu_labels, and sample_values
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // Build a Bubble Chart
        var trace2 = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            },
            text: otu_labels
        };
        var bubbleData = [trace2];
        var bubbleLayout = {
            xaxis: { title: "OTU ID" }
        };


        // Render the Bubble Chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);


        // For the Bar Chart, map the otu_ids to a list of strings for your yticks
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

        // Build a Bar Chart
        // Don't forget to slice and reverse the input data appropriately
        var trace1 = {
            y: yticks,
            x: sample_values.slice(0, 10).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        };
        var barData = [trace1];

        // Render the Bar Chart
        Plotly.newPlot("bar", barData);

    }).catch(error => console.error("Error loading chart data:", error));
}


// Function to run on page load
function init() {
    d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
        // Get the names field
        var names = data.names;


        // Use d3 to select the dropdown with id of `#selDataset`
        var select = d3.select("#selDataset");

        // Use the list of sample names to populate the select options
        // Hint: Inside a loop, you will need to use d3 to append a new
        // option for each sample name.
        names.forEach(name => {
            select.append("option").text(name).property("value", name);
        });


        // Get the first sample from the list
        var firstSample = names[0];

        // Build charts and metadata panel with the first sample
        buildCharts(firstSample);
        buildMetadata(firstSample);

    }).catch(error => console.error("Error during initialization:", error));
}


// Function for event listener
function optionChanged(newSample) {
    // Build charts and metadata panel each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
}

// Initialize the dashboard
init();