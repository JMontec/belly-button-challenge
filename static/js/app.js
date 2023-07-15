const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
});

function init() {

    let dropdownMenu = d3.select("#selDataset");

    d3.json(url).then((data) => {

        let names = data.names;

        names.forEach((id) => {

            dropdownMenu.append("Option")
            .text(id)
            .property("Value",id);
        });

        let sample_one = names[0];


        createMetadata(sample_one);
        createBarChart(sample_one);
        createBubbleChart(sample_one);
        createGaugeChart(sample_one);

    });
};

function createMetadata(sample) {

    d3.json(url).then((data) => {

        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        let valueData = value[0];
        d3.select("#sample-metadata").html("");

        Object.entries(valueData).forEach(([key,value]) => {

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

function createBarChart(sample) {

    d3.json(url).then((data) => {

        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];
        let sample_values = valueData.sample_values;
        let otu_labels = valueData.otu_labels;
        let otu_ids = valueData.otu_ids;

        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTUs Present"
        };

        Plotly.newPlot("bar", [trace], layout)
    });
};

function createBubbleChart(sample) {

    d3.json(url).then((data) => {

        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);
        let valueData = value[0];
        let sample_values = valueData.sample_values;
        let otu_labels = valueData.otu_labels;
        let otu_ids = valueData.otu_ids;

        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Bacterial Density per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", [trace1], layout)
    });
};

function optionChanged(value) { 
    createMetadata(value);
    createBubbleChart(value);
    createBarChart(value);
    createGaugeChart(value);
};

init();