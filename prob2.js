let svgDancingBar = d3.select("body").select("#dancing-bar-chart")
        console.log({ d3 })
    
        let width = 800;
        let height = 500;
    
        let svg = d3.select("body")
            .select("svg")
    
        d3.csv("healthcare-disposable-inc.csv").then(function (data) {
          console.log("loaded")
    console.log(data)

    data.forEach(d => {
      d.Percentile = +d.Percentile
    })

    let margin = { top: 0, right: 0, bottom: 30, left: 0 };

    let sel_cols = [
    "Medicaid",
    "Medicare",
    "Medicare+Medicaid",
    "Employer",
    "Uninsured",
    "Direct Purchase",
    "Subsidized Exchange",
    "CHIP",
    "Military",
    "Other"
    ]

    let sel_colors = [
    "#F44336",
    "#FF9800",
    "#FDD835",
    "#FFF8E1",
    "#26A69A",
    "#4DD0E1",
    "#F06292",
    "#5C6BC0",
    "#90A4AE",
    "#E0E0E0"
    ]

    let year_state = 2009;
    let d2020 = data.filter(d => d.year == 2020)
    let d2009 = data.filter(d => d.year == 2009)

    let series = d3.stack().keys(sel_cols)(d2009);
    console.log(series)

    let color = d3.scaleOrdinal()
        .domain(sel_cols)
        .range(sel_colors)

    let x = d3.scaleLinear()
        .domain([0, 100])
        .range([margin.left, width])

    let y = d3.scaleLinear()
        .domain([0, 1])
        .range([height - margin.bottom, margin.top])

    let area = d3.area()
        .x(d => x(d.data.Percentile))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))

    let xAxisSettings = d3.axisBottom(x)
        .tickSize(6)
        .tickPadding(6)
        .ticks(10)
        .tickFormat(d3.format(".0f"))
        .tickValues([5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95])

    let xAxis = svgDancingBar.append("g")
        .attr("class", "x axis")
        .call(xAxisSettings)
        .call(g => g.selectAll(".domain").remove())
        .attr("transform", `translate(0,${height - margin.bottom})`)

    let yAxisSettings = d3.axisLeft(y)
        .tickValues([.2, .4, .6, .8])
        .tickSize(0)
        .tickPadding(4)
        .tickFormat(d3.format(".0%"))

    let yAxis = svgDancingBar
        .append("g")
        .attrr("class", "y axis")
        .call(yAxisSettings)
        .call(g => g.selectAll(".domain").remove())

    let hed = d3.select(".hed")

  // Area chart
    let areaChart = svgDancingBar.append("g")

    areaChart
      .selectAll("path")
      .data(series)
      .join("path")
      .attr("class", d => d.key)
      .attr("fill", d => color(d.key))
      .attr("d", area)

    function update() {
      console.log("update")
      console.log("old year state " + year_state);

      if (year_state == "2020") {
          year_state = "2009"
          dance(d2009)
          hed.html("American Health Insurance across Incomes in <span class=highlightpink>2009</span>")

      } else {
          year_state = "2020"
          dance(d2020)
          hed.html("American Health Insurance across Incomes in <span class=highlightpink>2020</span>")

      }
      console.log("new year state " + year_state);
  }

  function dance(new_data) {
    new_series = d3.stack()
      .keys(sel_cols)
      (new_data);

    areaChart
      .selectAll("path")
      .data(new_series)
      .join("path")
      .attr("class", d => d.key)
      .transition()
      .duration(500)
      .ease(d3.easeLinear)
      .attr("fill", d => color(d.key))
      .attr("d", area)
  }

  var timer = d3.interval(update, 3000) //in milliseconds

   svgDancingBar.append("text")
      .attr("class", "label")
      .attr("x", 600)
      .attr("y", 250)
      .text("Employer")

   svgDancingBar.append("text")
      .attr("class", "label")
      .attr("x", 75)
      .attr("y", 430)
      .text("Medicaid")
      .style("fill", "black")

    svgDancingBar.append("text")
      .attr("class", "label")
      .attr("x", 75)
      .attr("y", 295)
      .text("Medicare")
      .style("fill", "black")

    svgDancingBar.append("text")
      .attr("class", "label")
      .attr("x", 75)
      .attr("y", 75)
      .text("Uninsured")
      .style("fill", "black")

    svgDancingBar.append("text")
      .attr("class", "axis-label")
      .attr("x", width / 2)
      .attr("y", height)
      .text("Income percentile")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")


})