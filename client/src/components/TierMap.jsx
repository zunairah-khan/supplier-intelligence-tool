import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import {useNavigate} from "react-router-dom";

const CRITICALITY_COLOURS = {
  High: "#FF0000",
  Medium: "#FFA500",
  Low: "#00FF00",
  Default: "#6b7280",
};

const TIER_COLOURS = {
  1: "#1D4ED8",
  2: "#3B82F6",
  3: "#93C5FD",
  4: "#BFDBFE",
  5: "#DBEAFE",
  Default: "#6b7280",
};

const TierMap = ({ data }) => {
  const svgRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    // If no data or data is not in expected format, do not attempt to render the tree. this protects against errors when data is missing or malformed.
    if (!data || !data.children) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    //get height and width of parent container
    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const margin = { top: 5, right: 5, bottom: 5, left: 5 };

  



    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create tooltip div in DOM to show hover content. this is done outside of the SVG to allow for better styling and positioning.
const tooltip = d3.select("body").append("div")
  .style("position", "absolute")
  .style("background","#EFF6FF")
  .style("padding", "6px 10px")
  .style("border-radius", "4px")
  .style("pointer-events", "none") // prevents tooltip from blocking mouse events
  .style("opacity", 0)
  .style("font-size", "12px")
  .style("box-shadow", "0 4px 12px rgba(0,0,0,0.2)");

    const g = svg
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

//zoom and pan setup
  const panFactor = 0.7; // 0.5 = half speed, 1 = normal speed
  const initialTransform = d3.zoomIdentity.translate(margin.left, margin.top).scale(1); //Set initial transform to position the tree nicely within the SVG to ensure tree isnt rendered of-screen on first load

  const zoom = d3.zoom()
  .scaleExtent([0.5, 2]) // keep zoom normal
  .on("zoom", (event) => {
    // Slow down panning by applying pan factor to translate events
    g.attr("transform", `translate(${event.transform.x * panFactor}, ${event.transform.y * panFactor}) scale(${event.transform.k})`);
  });

svg.call(zoom)
  .call(zoom.transform, initialTransform); // Set initial position and zoom level

    // Convert to D3 hierarchy
    const root = d3.hierarchy(data);

     // Node rectangles
  const rectWidth = 130;
  const rectHeight = 27;
  const rectRadius = 5;

    //custom node spacing
    const levels = root.height + 1; // total tiers
    const verticalSpacing = innerHeight / levels; // dynamic vertical spacing
    const horizontalSpacing = rectWidth+ 5; // fixed horizontal distance between nodes 

    // Tree layout
    const treeLayout = d3.tree().nodeSize([horizontalSpacing, verticalSpacing]);
    treeLayout(root);

    // Links
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      //link colour is determined from routeCriticality stored on the child node
      .attr("stroke", (d) => {
        return CRITICALITY_COLOURS[d.target.data.routeCriticality] || CRITICALITY_COLOURS.Default;
      })
      //link width is determined from routeCriticality stored on the child node
      .attr("stroke-width", (d) => 
        d.target.data.routeCriticality === "High" ? 3 : 2
      )
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y),
      );

    // Nodes
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    

    // Node rectangles
    node.append("rect")
  .attr("width", rectWidth)
  .attr("height", rectHeight)
  .attr("x", -rectWidth / 2)  // center horizontally
  .attr("y", -rectHeight / 2) // center vertically
  .attr("rx", rectRadius)
  .attr("ry", rectRadius)
  .attr("fill", d => d.data.name === "org" 
        ? TIER_COLOURS.Default 
        : TIER_COLOURS[d.data.tier] || TIER_COLOURS.Default)
  .attr("stroke", "none")
  .attr("stroke-width", 1)
  .attr("cursor", "pointer") 

  //-----NODE EVENTS----

  //when mouse enters the node
   .on("mouseover", function(event, d) {
    // Darken the rectangle
    d3.select(this)
      .attr("fill", d3.color(d.data.name === "org"
          ? TIER_COLOURS.Default
          : TIER_COLOURS[d.data.tier] || TIER_COLOURS.Default
        ).darker(0.7)
      );

    // Show tooltip
    tooltip
      .style("opacity", 1)
      .html(d.data.name === "org"
        ? "Organisation Root Node"
        : `Supplier: ${d.data.name}<br/>Tier: ${d.data.tier}<br/>Criticality: ${d.data.routeCriticality || "N/A"}`
      )
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px");
  })

  //when mouse moves within the node, update tooltip position to follow the cursor
  .on("mousemove", (event) => {
    tooltip
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY + 10 + "px");
  })

  //when mouse leaves the node
  .on("mouseout", function(event, d) {
    // Restore original rectangle color
    d3.select(this)
      .attr("fill", d.data.name === "org"
        ? TIER_COLOURS.Default
        : TIER_COLOURS[d.data.tier] || TIER_COLOURS.Default
      );

    // Hide tooltip
    tooltip.style("opacity", 0);})

  //when node is clicked, navigate to supplier details page if it's not the root node. Also hide tooltip on click to prevent it from lingering when navigating to new page.
  .on("click", (event, d) => 
  d.data.name !== "org" && (
    tooltip && tooltip.style("opacity", 0),
    navigate(`/suppliers/${d.data._id}`)
  )
);

  // Node labels (centered)
node.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "0.35em")
  .style("font-size", "12px")
  .style("fill", "#fff")
  .text(d => d.data.name);

  
   
  }, [data]);

  return <svg ref={svgRef} style={{ backgroundColor: "#F3F4F6", width: "100%", height: "100%" }}></svg>;
};

export default TierMap;
