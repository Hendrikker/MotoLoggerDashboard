var ctx1 = document.getElementById('Chart1').getContext('2d');
var chart1 = new Chart(ctx1, {
    type: 'line',
    data:{
        labels: [],
        datasets: []
    },
});
function AddToChart1(newdata, name) {
    // You create the new dataset `Vendas` with new data and color to differentiate
    var newDataset = {
        label: name,
        borderWidth: 1,
        data: newdata,
    }
    // You add the newly created dataset to the list of `data`
    chart1.data.datasets.push(newDataset);
    // You update the chart to take into account the new dataset
    chart1.update();
};
function ClearChart() {
    chart1 = new Chart(ctx1, {
        type: 'line',
        data:{
            labels: [],
            datasets: []
        },
    });
}
function ClearChart2() {
    for (i = 0; i < chart1.data.datasets.length; i++) {
        chart1.data.datasets.pop();
    }
}