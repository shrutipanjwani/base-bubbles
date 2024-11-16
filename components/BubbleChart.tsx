// components/BubbleChart.tsx
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ProcessedProjectData, FilterOptions } from "@/types/registry";

interface BubbleChartProps {
  data: ProcessedProjectData[];
  filters: FilterOptions;
  searchTerm?: string;
  width?: number;
  height?: number;
}

// Extend both SimulationNodeDatum and ProcessedProjectData
interface SimulationNode extends d3.SimulationNodeDatum, ProcessedProjectData {
  x: number;
  y: number;
  r: number;
}

const MAX_BUBBLE_SIZE = 150; // Maximum radius for the largest bubble
const MIN_BUBBLE_SIZE = 20; // Minimum radius for the smallest bubble

export const BubbleChart = ({
  data,
  filters,
  searchTerm = "",
  width = window.innerWidth - 100,
  height = window.innerHeight - 100,
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

    // Create color scale
    const colorScale = d3
      .scaleOrdinal<string>()
      .domain(["DeFi", "Infrastructure", "NFTs", "Games", "Social", "Other"])
      .range([
        "#3B82F6",
        "#10B981",
        "#8B5CF6",
        "#F59E0B",
        "#EC4899",
        "#6B7280",
      ]);

    // Create SVG with dark theme
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr(
        "style",
        "max-width: 100%; height: auto; background-color: #111827;"
      );

    // Create simulation with adjusted forces
    const simulation = d3
      .forceSimulation<SimulationNode>(nodes)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(-30))
      .force(
        "collide",
        d3.forceCollide<SimulationNode>().radius((d) => d.r + 2)
      )
      .force("x", d3.forceX(width / 2).strength(0.07))
      .force("y", d3.forceY(height / 2).strength(0.07));

    // Add gradient definitions
    const defs = svg.append("defs");
    nodes.forEach((node) => {
      const gradient = defs
        .append("radialGradient")
        .attr("id", `gradient-${node.id}`)
        .attr("gradientUnits", "objectBoundingBox");

      const color = colorScale(node.category);
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

    // Create node groups with updated styling
    const nodeElements = svg
      .append("g")
      .selectAll<SVGGElement, SimulationNode>("g")
      .data(nodes)
      .join("g")
      .attr("class", (d) => `node ${d.data.project_name.toLowerCase()}`);

    // Add circles with enhanced styling
    nodeElements
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => `url(#gradient-${d.id})`)
      .attr(
        "stroke",
        (d) =>
          d3.color(colorScale(d.category))?.brighter(0.3)?.toString() || "#fff"
      )
      .attr("stroke-width", 1.5)
      .style("filter", "drop-shadow(0px 4px 6px rgba(0,0,0,0.5))");

    // Update text styling for dark theme
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("font-size", (d) => Math.min(d.r / 2.5, 14))
      .style("fill", "#fff")
      .style("font-weight", "500")
      .text((d) => d.data.project_name);

    // Add percentage with updated styling
    nodeElements
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => -d.r - 5)
      .attr("fill", (d) => (d.data.pct_txs >= 0 ? "#34D399" : "#EF4444"))
      .style("font-size", "12px")
      .style("font-weight", "500")
      .text((d) => `${(d.data.pct_txs * 100).toFixed(2)}%`);

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
          .attr("stroke-width", 2)
          .style("filter", "drop-shadow(0px 2px 4px rgba(0,0,0,0.2))");
      })
      .on("click", (_, d) => setSelectedNode(d));

    // Update positions on simulation tick
    simulation.on("tick", () => {
      nodeElements.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Apply search highlighting
    if (searchTerm) {
      nodeElements.style("opacity", (d) =>
        d.data.project_name.toLowerCase().includes(searchTerm.toLowerCase())
          ? 1
          : 0.3
      );
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, filters, width, height, searchTerm]);

  return (
    <div className="relative w-full mt-8">
      <svg ref={svgRef} className="w-full" style={{ height }} />
      {selectedNode && (
        <div className="absolute top-4 right-4 p-4 bg-gray-800 rounded-lg shadow-lg max-w-md text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            {selectedNode.data.project_name}
            <span
              className={`text-sm ${
                selectedNode.data.pct_txs >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {(selectedNode.data.pct_txs * 100).toFixed(2)}%
            </span>
          </h3>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-medium">Transactions:</span>{" "}
              {selectedNode.data.txs.toLocaleString()}
            </p>
            <p>
              <span className="font-medium">ETH Fees:</span>{" "}
              {selectedNode.data.eth_fees.toFixed(2)} ETH
            </p>
            <p>
              <span className="font-medium">Monthly Active Users:</span>{" "}
              {selectedNode.data.mau.toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
