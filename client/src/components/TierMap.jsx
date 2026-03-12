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

    // Node circles
    node
      .append("circle")
      .attr("r", 10)

      .attr("fill", (d) =>
        d.data.name === "org" //org root node
          ? TIER_COLOURS.Default
          : TIER_COLOURS[d.data.tier] || TIER_COLOURS.Default,
      )
      //tooltip content is determined from node data

      .append("title")

      .text((d) =>
        d.data.name === "org"
          ? "Organisation Root Node"
          : `Supplier: ${d.data.name}
Tier: ${d.data.tier}
Criticality: ${d.data.routeCriticality || "N/A"}`,
      );

    // Labels
    node
      .append("text")
      .attr("dy", "0.35em")
      .attr("x", (d) => (d.children ? -16 : 16))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .style("font-size", "12px")
      .text((d) => d.data.name);
  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default TierMap;
