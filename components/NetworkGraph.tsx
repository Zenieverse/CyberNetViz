import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, NodeData, LinkData, NodeType } from '../types';
import { NODE_COLORS } from '../constants';

interface NetworkGraphProps {
  data: GraphData;
  onNodeSelect: (node: NodeData) => void;
  selectedNode: NodeData | null;
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, onNodeSelect, selectedNode }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // Use a ref for the callback to avoid restarting the simulation when the callback reference changes
  const onNodeSelectRef = useRef(onNodeSelect);
  useEffect(() => {
    onNodeSelectRef.current = onNodeSelect;
  }, [onNodeSelect]);

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: wrapperRef.current.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize and Render Graph
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;

    // Create a deep copy of data to avoid mutating props directly during simulation
    const nodes = data.nodes.map(d => ({ ...d })) as NodeData[];
    const links = data.links.map(d => ({ ...d })) as LinkData[];

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    // Define Zoom behavior
    const g = svg.append("g");
    gRef.current = g;
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    zoomRef.current = zoom;
    svg.call(zoom);

    // Links
    const link = g.append("g")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.strength || 1) * 2);

    // Node Groups
    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(d3.drag<SVGGElement, NodeData>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any
      )
      .on("click", (event, d) => {
        // Find the original node object to pass back
        const originalNode = data.nodes.find(n => n.id === d.id);
        if (originalNode && onNodeSelectRef.current) {
            onNodeSelectRef.current(originalNode);
        }
        event.stopPropagation();
      });

    // Node Circles
    node.append("circle")
      .attr("id", (d) => `node-${d.id}`) // Add ID for easier selection
      .attr("r", (d) => d.type === NodeType.SUSPECT ? 15 : 10)
      .attr("fill", (d) => NODE_COLORS[d.type] || '#ccc')
      .attr("stroke", (d) => (selectedNode?.id === d.id ? "#fff" : "#1e293b"))
      .attr("stroke-width", (d) => (selectedNode?.id === d.id ? 3 : 1.5))
      // Neon Glow effect
      .style("filter", (d) => `drop-shadow(0 0 5px ${NODE_COLORS[d.type]})`);

    // Node Labels
    node.append("text")
      .text((d) => d.label)
      .attr("x", 18)
      .attr("y", 5)
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "#e2e8f0")
      .attr("stroke", "none")
      .style("pointer-events", "none");

    // Simulation Tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: NodeData) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: NodeData) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: NodeData) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [data, dimensions]); // REMOVED onNodeSelect from dependencies to prevent restarts

  // Separate effect to handle selection highlighting and zooming
  useEffect(() => {
    if(!svgRef.current || !selectedNode || !zoomRef.current) return;

    const svg = d3.select(svgRef.current);

    // Update highlights
    svg.selectAll("circle")
       .attr("stroke", (d: any) => (d.id === selectedNode.id ? "#fff" : "#1e293b"))
       .attr("stroke-width", (d: any) => (d.id === selectedNode.id ? 3 : 1.5));
    
    // Attempt to fly to node if simulation has settled or we can access node position
    // Since we don't have direct access to the simulated node objects easily without re-selecting
    // We will search the data bound to the DOM elements
    const selectedElement = svg.select(`#node-${selectedNode.id}`);
    if (!selectedElement.empty()) {
       const nodeData = selectedElement.datum() as NodeData;
       if (nodeData.x !== undefined && nodeData.y !== undefined) {
          const { width, height } = dimensions;
          const scale = 1.5;
          const x = -nodeData.x * scale + width / 2;
          const y = -nodeData.y * scale + height / 2;
          
          svg.transition().duration(750).call(
             zoomRef.current.transform as any, 
             d3.zoomIdentity.translate(x, y).scale(scale)
          );
       }
    }

  }, [selectedNode, dimensions]);

  return (
    <div ref={wrapperRef} className="w-full h-full bg-cyber-950 rounded-lg overflow-hidden border border-cyber-800 relative">
      <div className="absolute top-4 left-4 z-10 bg-cyber-900/80 backdrop-blur p-2 rounded border border-cyber-800 text-xs text-slate-400">
        <h4 className="font-bold text-cyber-400 mb-1">Legend</h4>
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 5px ${color}` }}></span>
            <span className="capitalize">{type.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
      <svg ref={svgRef} width="100%" height="100%" className="w-full h-full" />
    </div>
  );
};

export default NetworkGraph;