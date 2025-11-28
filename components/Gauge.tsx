import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit?: string;
  color?: string;
}

export const Gauge: React.FC<GaugeProps> = ({ value, min, max, label, unit, color = "#00A8E8" }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Reduced dimensions to fit in container (approx 15% smaller)
    const width = 95; 
    const height = 85; 
    const radius = 50; 
    const cx = width / 2;
    const cy = height - 5;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Background Arc (Dark Blue)
    const bgArc = d3.arc()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    svg.append("path")
      .attr("d", bgArc as any)
      .attr("transform", `translate(${cx}, ${cy})`)
      .attr("fill", "#0f172a") // Slate 900
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1);

    // Value Arc
    const scale = d3.scaleLinear().domain([min, max]).range([-Math.PI / 2, Math.PI / 2]);
    const safeValue = Math.min(Math.max(value, min), max);
    
    const valArc = d3.arc()
      .innerRadius(radius - 10)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(scale(safeValue));

    svg.append("path")
      .attr("d", valArc as any)
      .attr("transform", `translate(${cx}, ${cy})`)
      .attr("fill", color)
      .style("filter", "drop-shadow(0px 0px 4px " + color + ")");

    // Ticks
    const ticks = scale.ticks(5);
    ticks.forEach(tick => {
        const angle = scale(tick) - Math.PI / 2;
        const x = cx + (radius - 16) * Math.cos(angle);
        const y = cy + (radius - 16) * Math.sin(angle);
        
        svg.append("text")
           .attr("x", x)
           .attr("y", y)
           .attr("text-anchor", "middle")
           .attr("fill", "#64748b")
           .attr("font-size", "8px")
           .text(tick);
    });

    // Value Text
    svg.append("text")
      .attr("x", cx)
      .attr("y", cy - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text(Math.round(value));

    // Label
    svg.append("text")
      .attr("x", cx)
      .attr("y", cy + 12) // Below center
      .attr("text-anchor", "middle")
      .attr("fill", "#94a3b8")
      .attr("font-size", "10px")
      .text(label);

  }, [value, min, max, label, unit, color]);

  return <svg ref={svgRef} width={120} height={95} className="mx-auto" />;
};