// components/BubbleChart.tsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  ProcessedProjectData,
  FilterOptions,
  Category,
} from "@/types/registry";
import { getCategoryColor, formatMetricValue } from "@/services/duneService";
import { formatProjectName } from "@/utils/formatting";

interface BubbleChartProps {
  data: ProcessedProjectData[];
  filters: FilterOptions;
  searchTerm?: string;
  width?: number;
  height?: number;
}

interface SimulationNode extends d3.SimulationNodeDatum, ProcessedProjectData {
  x: number;
  y: number;
  r: number;
}

const MAX_BUBBLE_SIZE = 150;
const MIN_BUBBLE_SIZE = 20;

export const BubbleChart = ({
  data,
  filters,
  searchTerm = "",
  width = window.innerWidth - 100,
  height = window.innerHeight,
}: BubbleChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<ProcessedProjectData | null>(
    null
  );

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    // Calculate size scale with limits
    const sizeScale = d3
      .scaleSqrt()
      .domain([
        d3.min(data, (d) => d.value) || 0,
        d3.max(data, (d) => d.value) || 0,
      ])
      .range([MIN_BUBBLE_SIZE, MAX_BUBBLE_SIZE]);

    // Process data for simulation
    const nodes: SimulationNode[] = data.map((d) => ({
      ...d,
      x: Math.random() * width,
      y: Math.random() * height,
      r: sizeScale(d.value),
      vx: 0,
      vy: 0,
      index: 0,
    }));

    // Create SVG with dark theme
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; background-color: transparent;"
      );

    // Create simulation
    const simulation = d3
      .forceSimulation<SimulationNode>(nodes)
      .force("charge", d3.forceManyBody().strength(-100))
      .force(
        "collide",
        d3
          .forceCollide<SimulationNode>()
          .radius((d) => d.r + 4) // Increased padding between bubbles
          .strength(1) // Maximum collision strength
      )
      // Add more spread out forces
      .force("x", d3.forceX(width / 2).strength(0.02)) // Reduced x-axis centering force
      .force("y", d3.forceY(height / 2).strength(0.02)) // Reduced y-axis centering force
      // Add forces to prevent clustering
      .force(
        "anti-cluster",
        d3
          .forceManyBody()
          .strength(-10)
          .distanceMax(width / 2)
      )
      // Add boundary forces to keep nodes within the viewport
      .force("bounds", () => {
        for (const node of nodes) {
          if (node.x !== undefined && node.y !== undefined) {
            node.x = Math.max(node.r, Math.min(width - node.r, node.x));
            node.y = Math.max(node.r, Math.min(height - node.r, node.y));
          }
        }
      });

    // Create gradient definitions
    const defs = svg.append("defs");
    nodes.forEach((node) => {
      const gradient = defs
        .append("radialGradient")
        .attr("id", `gradient-${node.id?.replace(/\s+/g, "-")}`)
        .attr("gradientUnits", "objectBoundingBox");

      const color = getCategoryColor(node.category as Category);
      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr(
          "stop-color",
          d3.color(color)?.brighter(0.5)?.toString() || color
        );
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.color(color)?.darker(0.5)?.toString() || color);
    });

    // Create node groups
    const nodeElements = svg
      .append("g")
      .selectAll<SVGGElement, SimulationNode>("g")
      .data(nodes)
      .join("g")
      .attr(
        "class",
        (d) => `node ${d.data.name.replace(/\s+/g, "-").toLowerCase()}`
      );

    // Add circles
    nodeElements
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => `url(#gradient-${d.id?.replace(/\s+/g, "-")})`)
      .attr("stroke", (d) => getCategoryColor(d.category as Category))
      .attr("stroke-width", 1.5)
      .style("filter", "drop-shadow(0px 4px 6px rgba(0,0,0,0.5))");

    // Update the label rendering
    nodeElements.each(function (d: SimulationNode) {
      const text = d3
        .select(this)
        .append("text")
        .attr("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-weight", "500");

      const words = formatProjectName(d.data.name).split(" ");

      if (words.length > 1) {
        // First line
        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", "-0.3em")
          .style("font-size", () => Math.min(d.r / 3, 14))
          .text(words[0]);

        // Second line
        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", "1.2em")
          .style("font-size", () => Math.min(d.r / 3, 14))
          .text(words.slice(1).join(" "));
      } else {
        // Single line
        text
          .append("tspan")
          .attr("x", 0)
          .attr("dy", ".3em")
          .style("font-size", () => Math.min(d.r / 2.5, 14))
          .text(words[0]);
      }
    });

    // // Add growth indicators
    // nodeElements
    //   .append("text")
    //   .attr("text-anchor", "middle")
    //   .attr("dy", (d) => -d.r - 5)
    //   .attr("fill", (d) => (d.growth >= 0 ? "#34D399" : "#EF4444"))
    //   .style("font-size", "12px")
    //   .style("font-weight", "500")
    //   .text((d) => `${d.growth.toFixed(1)}%`);

    // Add hover effects
    nodeElements
      .on("mouseover", function () {
        d3.select(this)
          .select("circle")
          .attr("stroke-width", 3)
          .style("filter", "drop-shadow(0px 4px 8px rgba(0,0,0,0.3))");
      })
      .on("mouseout", function () {
        d3.select(this)
          .select("circle")
          .attr("stroke-width", 1.5)
          .style("filter", "drop-shadow(0px 4px 6px rgba(0,0,0,0.5))");
      })
      .on("click", (_, d) => setSelectedNode(d));

    // Handle search highlighting
    if (searchTerm) {
      nodeElements.style("opacity", (d) =>
        d.id.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0.3
      );
    } else {
      nodeElements.style("opacity", 1);
    }

    // Update positions
    simulation.on("tick", () => {
      nodeElements.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data, filters, width, height, searchTerm]);

  // First, let's add a helper function for safe number formatting
  const formatPercentage = (
    value: number | string | null | undefined
  ): string => {
    if (value === null || value === undefined) return "0.0";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? "0.0" : numValue.toFixed(1);
  };

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!svgRef.current?.contains(event.target as Node)) {
        setSelectedNode(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full mt-8">
      <svg ref={svgRef} className="w-full" style={{ height }} />
      {selectedNode && (
        <div className="absolute top-4 right-4 p-4 bg-black rounded-lg shadow-lg max-w-md text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            {formatProjectName(selectedNode.data.name)}
            {/* <span
              className={`text-sm ${
                Number(selectedNode.growth) >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {formatPercentage(selectedNode.growth)}%
            </span> */}
          </h3>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-medium">Total Transactions:</span>{" "}
              {formatMetricValue(selectedNode.data.total_txs, "total_txs")}
            </p>
            <p>
              <span className="font-medium">Total Users:</span>{" "}
              {formatMetricValue(selectedNode.data.total_users, "total_users")}
            </p>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="font-medium mb-2">Growth Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Weekly Transactions</p>
                  <p
                    className={
                      Number(selectedNode.data.txs_last_7_days_perc) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {formatPercentage(selectedNode.data.txs_last_7_days_perc)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Monthly Transactions</p>
                  <p
                    className={
                      Number(selectedNode.data.txs_last_30_days_perc) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {formatPercentage(selectedNode.data.txs_last_30_days_perc)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Weekly Users</p>
                  <p
                    className={
                      Number(selectedNode.data.users_last_7_days_perc) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {formatPercentage(selectedNode.data.users_last_7_days_perc)}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Monthly Users</p>
                  <p
                    className={
                      Number(selectedNode.data.users_last_30_days_perc) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {formatPercentage(
                      selectedNode.data.users_last_30_days_perc
                    )}
                    %
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <a
                  href={`/${selectedNode.data.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="block w-full text-center py-2 px-4 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Learn more about {formatProjectName(selectedNode.data.name)}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
