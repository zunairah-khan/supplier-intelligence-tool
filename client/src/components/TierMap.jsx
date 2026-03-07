import React from 'react'

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const TierMap = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 1000;
    const height = 600;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const root = d3.hierarchy(data);

    const treeLayout = d3.tree().size([height - 100, width - 200]);

    treeLayout(root);

    const g = svg.append("g").attr("transform", "translate(100,50)");

    // Links
    g.selectAll("path")
      .data(root.links())
      .enter()
      .append("path")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2);

    // Nodes
    const nodes = g
      .selectAll("g.node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodes
      .append("circle")
      .attr("r", 8)
      .attr("fill", (d) => {
        if (d.data.tier === 1) return "#3b82f6";
        if (d.data.tier === 2) return "#10b981";
        if (d.data.tier === 3) return "#f59e0b";
        return "#111827";
      });

    nodes
      .append("text")
      .attr("dx", 12)
      .attr("dy", 4)
      .style("font-size", "13px")
      .text((d) => d.data.name);

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default TierMap;