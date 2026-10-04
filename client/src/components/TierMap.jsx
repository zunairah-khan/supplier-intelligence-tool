// Renders an interactive supplier hierarchy using D3's tree layout. Supports automatic layout, navigation, and visual encoding of supply route criticality and supplier tier information.

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";


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
    // Validate the hierarchy before attempting to render.
    if (!data || !data.children) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Determine the available rendering area by measuring the parent container's dimensions.
    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Define margins to provide padding around the tree layout, preventing clipping of nodes and links.
    const margin = { top: 5, right: 5, bottom: 5, left: 5 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create tooltip div in DOM to show hover content. This is done outside of the SVG to allow for better styling and positioning.
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#EFF6FF")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("pointer-events", "none") // prevents tooltip from blocking mouse events
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("box-shadow", "0 4px 12px rgba(0,0,0,0.2)");

    // Create a group element to contain the tree layout, applying margins to ensure the tree is not clipped by the SVG edges.
    const g = svg
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Convert hierarchical data into D3's hierarchy model.
    const root = d3.hierarchy(data);

    // Node dimensions used throughout the layout.
    const rectWidth = 130;
    const rectHeight = 27;
    const rectRadius = 5;

    // Calculate dynamic spacing based on hierarchy depth.
    const levels = root.height + 1; // total tiers
    const verticalSpacing = innerHeight / levels; // dynamic vertical spacing
    const horizontalSpacing = rectWidth + 5; // fixed horizontal distance between nodes

    // Compute node coordinates using D3's tree layout.
    const treeLayout = d3.tree().nodeSize([horizontalSpacing, verticalSpacing]);
    treeLayout(root);

    // --- AUTO-CENTERING ---
    //collect all node positions
    const nodes = root.descendants();
    const xValues = nodes.map((d) => d.x);
    const yValues = nodes.map((d) => d.y);

    //find bounds
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    //compute tree center
    const centerX = (xMin + xMax) / 2;
    const centerY = (yMin + yMax) / 2;

    //compute container center
    const svgCenterX = innerWidth / 2;
    const svgCenterY = innerHeight / 2;

    //compute translation needed to center tree
    const offsetX = svgCenterX - centerX;
    const offsetY = svgCenterY - centerY;

    // apply translation to the group containing the tree layout
    g.attr(
      "transform",
      `translate(${margin.left + offsetX}, ${margin.top + offsetY})`,
    );

    // --- ZOOM AND PAN ---
    const panFactor = 0.7; // 0.5 = half speed, 1 = normal speed
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 2]) // Limit zoom levels to prevent excessive zooming in or out
      .on("zoom", (event) => {
        // Apply the zoom transformation to the group containing the tree layout, adjusting for the pan factor to control the speed of panning relative to zooming.
        g.attr(
          "transform",
          `translate(${event.transform.x * panFactor}, ${event.transform.y * panFactor}) scale(${event.transform.k})`,
        );
      });

    // Set the initial zoom and pan to center the tree within the SVG viewport.
    const initialTransform = d3.zoomIdentity
      .translate(margin.left + offsetX, margin.top + offsetY)
      .scale(1);

    svg.call(zoom).call(zoom.transform, initialTransform); // apply initial transform

    // --- LINKS ---
    g.selectAll(".link") 
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      // Route criticality determines link colour.
      .attr("stroke", (d) => {
        return (
          CRITICALITY_COLOURS[d.target.data.routeCriticality] ||
          CRITICALITY_COLOURS.Default
        );
      })
      // Route criticality also influences link width.
      .attr("stroke-width", (d) =>
        d.target.data.routeCriticality === "High" ? 3 : 2,
      )
      .attr(
        "d",
        d3
          .linkVertical()
          .x((d) => d.x)
          .y((d) => d.y),
      );

    // Render supplier nodes.
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.x},${d.y})`);

    // Render node rectangles.
    node
      .append("rect")
      .attr("width", rectWidth)
      .attr("height", rectHeight)
      .attr("x", -rectWidth / 2) // center horizontally
      .attr("y", -rectHeight / 2) // center vertically
      .attr("rx", rectRadius)
      .attr("ry", rectRadius)
      // Apply colour based on supplier tier.
      .attr("fill", (d) =>
        d.data.name === "org"
          ? TIER_COLOURS.Default
          : TIER_COLOURS[d.data.tier] || TIER_COLOURS.Default,
      )
      .attr("stroke", "none")
      .attr("stroke-width", 1)
      .attr("cursor", "pointer")

      // ---------- Node interaction ----------

      // Highlight the hovered node
      .on("mouseover", function (event, d) {
        
        d3.select(this).attr(
          "fill",
          d3
            .color(
              d.data.name === "org"
                ? TIER_COLOURS.Default
                : TIER_COLOURS[d.data.tier] || TIER_COLOURS.Default,
            )
            .darker(0.7),
        );

        // Show tooltip
        tooltip
          .style("opacity", 1)
          .html(
            d.data.name === "org"
              ? "Organisation Root Node"
              : `Supplier: ${d.data.name}<br/>Tier: ${d.data.tier}<br/>Criticality: ${d.data.routeCriticality || "N/A"}`,
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
      })

      //when mouse moves within the node, keep the tooltip aligned with the cursor.
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
      })

      //when mouse leaves the node, restore the original node colour and hide the tooltip.
      .on("mouseout", function (event, d) {
        
        d3.select(this).attr(
          "fill",
          d.data.name === "org"
            ? TIER_COLOURS.Default
            : TIER_COLOURS[d.data.tier] || TIER_COLOURS.Default,
        );

        
        tooltip.style("opacity", 0);
      })

      // Navigate to the supplier details view when a supplier node is selected and hide tooltip on click to prevent it from lingering when navigating to new page.
      .on(
        "click",
        (event, d) =>
          d.data.name !== "org" &&
          (tooltip && tooltip.style("opacity", 0),
          navigate(`/suppliers/${d.data._id}`)),
      );

    // Render centred supplier labels.
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "12px")
      .style("fill", "#fff")
      .text((d) => d.data.name);
  }, [data]);
  
// Root SVG container for the visualisation.
  return (
    <svg
      ref={svgRef}
      style={{ backgroundColor: "#F3F4F6", width: "100%", height: "100%" }}
    ></svg>
  );
};

export default TierMap;
