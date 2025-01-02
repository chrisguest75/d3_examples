/**
 * group trades by day
 * @param trades 
 * */
function groupTradesByDay(trades) {
    const grouped = trades.reduce((acc, trade) => {
        const day = trade.at.split('T')[0]
        if (!acc[day]) {
            acc[day] = []
        }
        acc[day].push(trade)
        return acc
    }, {})

    return grouped
}

function aggregateTrades(trades) {
    const aggregated = trades.reduce((acc, trade) => {
        if (trade.type === 'buy') {
            acc.buy += trade.value
            acc.numBuys++
            if ((acc.minBuy == 0) || (trade.value < acc.minBuy)) {
                acc.minBuy = trade.value
            }
            if (trade.value > acc.maxBuy) {
                acc.maxBuy = trade.value
            }
        } else {
            acc.sell += trade.value
            acc.numSells++
            if ((acc.minSell == 0) || (trade.value < acc.minSell)) {
                acc.minSell = trade.value
            }
            if (trade.value > acc.maxSell) {
                acc.maxSell = trade.value
            }
        }
        acc.profit = acc.sell - acc.buy
        return acc
    }, { buy: 0, sell: 0, numTrades: trades.length, numBuys: 0, numSells: 0, minSell: 0, maxSell: 0, minBuy: 0, maxBuy: 0, avgBuy: 0, avgSell: 0, profit: 0 })

    // calculate averages
    aggregated.avgBuy = aggregated.buy / aggregated.numBuys
    aggregated.avgSell = aggregated.sell / aggregated.numSells

    // round to 3 decimal places
    aggregated.avgBuy = Math.round(aggregated.avgBuy * 1000) / 1000
    aggregated.avgSell = Math.round(aggregated.avgSell * 1000) / 1000

    return aggregated
}

/**
 * draw trades chart
 */
function drawChart(id, aggregated) {
    // Set dimensions and margins for the chart
    const margin = { top: 70, right: 60, bottom: 50, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Set up the x and y scales
    const x = d3.scaleTime()
        .range([0, width]);

    const y = d3.scaleLinear()
        .range([height, 0]);

    // Create the SVG element and append it to the chart container
    const svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set the domains for the x and y scales
    x.domain(d3.extent(aggregated, d => d.Date));
    y.domain([0, d3.max(aggregated, d => d.value)]);

    // Add the x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the y-axis
    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(y).tickFormat(d => {
            if (isNaN(d)) return "";
            return `£${d.toFixed(2)}`;
        })
        )

    // Set up the line generator
    const line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.value));

    // Create an area generator
    const area = d3.area()
        .x(d => x(d.Date))
        .y0(height)
        .y1(d => y(d.value));

    // Add the area path
    svg.append("path")
        .datum(aggregated)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "#85bb65")
        .style("opacity", .5);

    // Add the line path
    svg.append("path")
        .datum(aggregated)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "#85bb65")
        .attr("stroke-width", 1)
        .attr("d", line);
}

d3.json("14_line_charts/data/trades.json").then(data1 => {
    // Load and process the data
    const trades = data1
    const grouped = groupTradesByDay(trades)

    console.log(grouped)
    const aggregated = Object.keys(grouped).map(key => {
        const trades = grouped[key]
        return {
            Date: key,
            ...aggregateTrades(trades)
        }
    })
    console.log(aggregated)

    const parseDate = d3.timeParse("%Y-%m-%d");

    const buys = [];
    aggregated.forEach(d => {
        const item = { Date: parseDate(d.Date), value: d.buy};
        buys.push(item);
    });
    console.log(buys)
    drawChart("#trades1", buys)

    const sells = [];
    aggregated.forEach(d => {
        const item = { Date: parseDate(d.Date), value: d.sell};
        sells.push(item);
    });
    console.log(sells)
    drawChart("#trades2", sells)

    const profit = [];
    let profitValue = 0;
    aggregated.forEach(d => {
        profitValue -= d.profit;
        const item = { Date: parseDate(d.Date), value: profitValue};
        profit.push(item);
    });
    console.log(profit)
    drawChart("#trades3", profit)
})
