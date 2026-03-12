import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

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

const TierMap = ({ data, width = 900, height = 500 }) => {
  const svgRef = useRef();

  useEffect(() => {
    // If no data or data is not in expected format, do not attempt to render the tree. this protects against errors when data is missing or malformed.
    if (!data || !data.children) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 50, right: 120, bottom: 50, left: 120 };

    // Zoom and pan
    const zoom = d3.zoom().on("zoom", (event) => {
      svg.select("g").attr("transform", event.transform);
    });
    svg.call(zoom);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create tooltip div in DOM to show hover content. This is done outside of the SVG to allow for better styling and positioning.
const tooltip = d3.select("body").append("div")
  .style("position", "absolute")
  .style("background", "#333")
  .style("color", "#fff")
  .style("padding", "6px 10px")
  .style("border-radius", "4px")
  .style("pointer-events", "none") // prevents tooltip from blocking mouse events
  .style("opacity", 0)
  .style("font-size", "12px");

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Convert to D3 hierarchy
    const root = d3.hierarchy(data);

    // Tree layout
    const treeLayout = d3.tree().size([innerHeight, innerWidth]);

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
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x),
      );

    // Nodes
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // Node rectangles
const rectWidth = 120;
const rectHeight = 27;
const rectRadius = 5;

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
  //hover events

  //when mouse enters the node, show the tooltip with supplier details.
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

  // Node labels (centered)
node.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "0.35em")
  .style("font-size", "12px")
  .style("fill", "#fff")
  .text(d => d.data.name);

  
   
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default TierMap;
