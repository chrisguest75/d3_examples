// create tooltip div
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

// Create a second tooltip div for raw date

const tooltipRawDate = d3.select("body")
    .append("div")
    .attr("class", "tooltip");

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
    const margin = { top: 50, right: 80, bottom: 30, left: 50 };
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
    // work out the max value for the y-axis
    if (d3.max(aggregated, d => d.value) >= 0) {
        y.domain([0, d3.max(aggregated, d => d.value)]);
        colour = "#85bb65";
    } else {
        y.domain([d3.min(aggregated, d => d.value), 0]);
        colour = "#d62728";
    }

    // Add the x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add the y-axis
    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(y).tickFormat(d => {
            if (isNaN(d)) return "";
            return `£${d.toFixed(0)}`;
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
        .style("fill", colour)
        .style("opacity", .5);

    // Add the line path
    svg.append("path")
        .datum(aggregated)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", colour)
        .attr("stroke-width", 1)
        .attr("d", line);

    const circle = svg.append("circle")
        .attr("r", 0)
        .attr("fill", "red")
        .style("stroke", "white")
        .attr("opacity", 0.7)
        .style("pointer-events", "none");

    // Add red lines extending from the circle to the date and value

    const tooltipLineX = svg.append("line")
        .attr("class", "tooltip-line")
        .attr("id", "tooltip-line-x")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");

    const tooltipLineY = svg.append("line")
        .attr("class", "tooltip-line")
        .attr("id", "tooltip-line-y")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "2,2");

    // create a listening rectangle

    const listeningRect = svg.append("rect")
        .attr("width", width)
        .attr("height", height);


    // create the mouse move function

    listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => d.Date).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(aggregated, x0, 1);
        const d0 = aggregated[i - 1];
        const d1 = aggregated[i];
        const d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;
        const xPos = x(d.Date);
        const yPos = y(d.value);

        // UpDate the circle position

        circle.attr("cx", xPos).attr("cy", yPos);


        // Add transition for the circle radius

        circle.transition()
            .duration(50)
            .attr("r", 5);

        // Update the position of the red lines

        tooltipLineX.style("display", "block").attr("x1", xPos).attr("x2", xPos).attr("y1", 0).attr("y2", height);
        tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos).attr("x1", 0).attr("x2", width);


        // add in our tooltip

        tooltip
            .style("display", "block")
            .style("left", `${width + 90}px`)
            .style("top", `${yPos + 68}px`)
            .html(`$${d.value !== undefined ? d.value.toFixed(2) : 'N/A'}`);


        tooltipRawDate
            .style("display", "block")
            .style("left", `${xPos + 60}px`)
            .style("top", `${height + 53}px`)
            .html(`${d.Date !== undefined ? d.Date.toISOString().slice(0, 10) : 'N/A'}`);

    });

    listeningRect.on("mouseleave", function () {
        circle.transition().duration(50).attr("r", 0);
        tooltip.style("display", "none");
        tooltipRawDate.style("display", "none");
        tooltipLineX.attr("x1", 0).attr("x2", 0);
        tooltipLineY.attr("y1", 0).attr("y2", 0);
        tooltipLineX.style("display", "none");
        tooltipLineY.style("display", "none");
    });
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
        const item = { Date: parseDate(d.Date), value: d.numBuys };
        buys.push(item);
    });
    console.log(buys)
    drawChart("#trades1", buys)

    const accbuys = [];
    let buysValue = 0;
    aggregated.forEach(d => {
        buysValue += d.numBuys;
        const item = { Date: parseDate(d.Date), value: buysValue };
        accbuys.push(item);
    });
    console.log(buys)
    drawChart("#trades2", accbuys)

    const sells = [];
    aggregated.forEach(d => {
        const item = { Date: parseDate(d.Date), value: d.numSells };
        sells.push(item);
    });
    console.log(sells)
    drawChart("#trades3", sells)

    const accsells = [];
    let sellsValue = 0;
    aggregated.forEach(d => {
        sellsValue += d.numSells;
        const item = { Date: parseDate(d.Date), value: sellsValue };
        accsells.push(item);
    });
    console.log(buys)
    drawChart("#trades4", accsells)

    const profit = [];
    let profitValue = 0;
    aggregated.forEach(d => {
        profitValue += d.profit;
        const item = { Date: parseDate(d.Date), value: profitValue };
        profit.push(item);
    });
    console.log(profit)
    drawChart("#trades5", profit)
})
