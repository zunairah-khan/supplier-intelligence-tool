
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const TierMap = ({ data, width = 900, height = 500 }) => {

  const svgRef = useRef();

  useEffect(() => {

    if (!data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 40, right: 120, bottom: 40, left: 120 };

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
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3.linkHorizontal()
          .x(d => d.y)
          .y(d => d.x)
      );

    // Nodes
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    // Node circles
    node.append("circle")
      .attr("r", 10)
      .attr("fill", d => {
        if (!d.parent) return "#111827"; // root
        if (d.data.tier === 1) return "#2563eb";
        if (d.data.tier === 2) return "#16a34a";
        if (d.data.tier === 3) return "#f59e0b";
        return "#6b7280";
      });

    // Labels
    node.append("text")
      .attr("dy", "0.35em")
      .attr("x", d => (d.children ? -16 : 16))
      .attr("text-anchor", d => (d.children ? "end" : "start"))
      .style("font-size", "12px")
      .text(d => d.data.name);

  }, [data, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default TierMap;