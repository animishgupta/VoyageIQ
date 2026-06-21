import heapq
import json
import logging
from typing import Dict, List, Tuple, Any, Optional
from groq import Groq
from app.config import settings

logger = logging.getLogger("uvicorn.error")

class RouteEdge:
    def __init__(
        self, 
        to_city: str, 
        cost: float, 
        travel_time: float, 
        scenic_score: float, 
        transport_mode: str
    ):
        self.to_city = to_city
        self.cost = cost
        self.travel_time = travel_time
        self.scenic_score = scenic_score  # Scale 1-10
        self.transport_mode = transport_mode

class RouteIntelligenceEngine:
    def __init__(self):
        # Directed graph represented as adjacency list
        self.graph: Dict[str, List[RouteEdge]] = {}
        self._initialize_default_graph()

    def add_route(
        self, 
        from_city: str, 
        to_city: str, 
        cost: float, 
        travel_time: float, 
        scenic_score: float, 
        transport_mode: str
    ):
        if from_city not in self.graph:
            self.graph[from_city] = []
        
        edge = RouteEdge(to_city, cost, travel_time, scenic_score, transport_mode)
        self.graph[from_city].append(edge)

    def _initialize_default_graph(self):
        # Prepopulate default graph to fulfill requirements and demo paths
        routes = [
            # North-East Hub
            ("Delhi", "Dehradun", 900, 5.0, 8, "Car"),
            ("Delhi", "Agra", 500, 3.0, 4, "Car"),
            ("Delhi", "Jaipur", 600, 5.0, 4, "Bus"),
            ("Delhi", "Srinagar", 4500, 1.5, 9, "Flight"),
            ("Delhi", "Mumbai", 5500, 2.0, 5, "Flight"),
            ("Delhi", "Bangalore", 6500, 2.5, 5, "Flight"),
            ("Delhi", "Lucknow", 1200, 6.0, 3, "Train"),
            ("Delhi", "Manali", 1500, 12.0, 9, "Bus"),
            ("Delhi", "Nainital", 1000, 7.0, 8, "Car"),
            ("Delhi", "Darjeeling", 5500, 2.2, 8, "Flight"),
            ("Delhi", "Andaman Islands", 7500, 3.5, 6, "Flight"),
            
            # Lucknow & Agra & Jaipur
            ("Lucknow", "Agra", 800, 4.0, 5, "Car"),
            ("Lucknow", "Dehradun", 2500, 12.0, 6, "Flight"),
            ("Agra", "Jaipur", 700, 4.5, 6, "Train"),
            ("Jaipur", "Udaipur", 800, 6.0, 7, "Train"),
            ("Jaipur", "Dehradun", 1800, 8.0, 7, "Train"),
            
            # Kashmir / North Alpine
            ("Dehradun", "Srinagar", 3500, 1.2, 9, "Flight"),
            ("Srinagar", "Gulmarg", 1200, 1.8, 10, "Car"),
            ("Srinagar", "Ladakh", 2000, 8.0, 10, "Car"),
            ("Manali", "Dehradun", 1800, 8.0, 8, "Train"),
            
            # Western / Southern Hubs
            ("Mumbai", "Goa", 1200, 10.0, 8, "Train"),
            ("Mumbai", "Bangalore", 3500, 1.5, 6, "Flight"),
            ("Mumbai", "Udaipur", 2500, 12.0, 7, "Train"),
            ("Bangalore", "Goa", 1500, 8.0, 7, "Bus"),
            ("Bangalore", "Munnar", 1200, 9.0, 9, "Bus"),
            ("Bangalore", "Ooty", 800, 6.0, 8, "Bus"),
            ("Bangalore", "Andaman Islands", 6000, 2.2, 7, "Flight"),
            
            # Coastal / Beach routes
            ("Goa", "Gokarna", 500, 3.0, 8, "Car"),
            ("Gokarna", "Varkala", 1800, 12.0, 9, "Train"),
            ("Ooty", "Munnar", 1000, 5.0, 9, "Car"),
            ("Munnar", "Varkala", 900, 4.5, 8, "Car"),
            
            # East
            ("Darjeeling", "Sikkim", 1000, 4.0, 9, "Car")
        ]
        
        for from_c, to_c, cost, time, scenic, mode in routes:
            self.add_route(from_c, to_c, cost, time, scenic, mode)
            # Add reverse routes as well for two-way travel (undirected simulation)
            self.add_route(to_c, from_c, cost, time, scenic, mode)

    def dijkstra(
        self, 
        start: str, 
        end: str, 
        cost_weight: float = 0.4, 
        time_weight: float = 0.4, 
        scenic_weight: float = 0.2
    ) -> Optional[Tuple[List[str], float]]:
        """
        Standard Dijkstra algorithm to find the absolute shortest single path
        based on custom weights (summing to 1).
        """
        if start not in self.graph or end not in self.graph:
            return None

        # Min-heap stores: (weighted_score, current_city, path_list)
        queue = [(0.0, start, [start])]
        visited = set()

        while queue:
            (score, current, path) = heapq.heappop(queue)

            if current == end:
                return path, score

            if current in visited:
                continue
            visited.add(current)

            for edge in self.graph.get(current, []):
                if edge.to_city not in visited:
                    # Metric calculation: Lower is better
                    # Convert scenic score to cost (10 - scenic) so that a higher scenic score decreases weight.
                    edge_weight = (
                        (edge.cost * cost_weight) + 
                        (edge.travel_time * 100 * time_weight) +  # scale time to cost magnitude
                        ((10 - edge.scenic_score) * 100 * scenic_weight)
                    )
                    heapq.heappush(queue, (score + edge_weight, edge.to_city, path + [edge.to_city]))

        return None

    def find_all_simple_paths(
        self, 
        start: str, 
        end: str, 
        visited: set, 
        path: List[str]
    ) -> List[List[str]]:
        """DFS recursive search to find all loop-free paths from start to end."""
        if start == end:
            return [path + [end]]
        
        paths = []
        visited.add(start)
        for edge in self.graph.get(start, []):
            next_node = edge.to_city
            if next_node not in visited:
                new_paths = self.find_all_simple_paths(next_node, end, visited, path + [start])
                paths.extend(new_paths)
        visited.remove(start)
        return paths

    def get_top_routes(
        self, 
        start: str, 
        end: str, 
        cost_weight: float = 0.4, 
        time_weight: float = 0.4, 
        scenic_weight: float = 0.2, 
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Finds all simple paths, calculates individual metrics,
        ranks them by custom weight parameters, and returns top K routes.
        """
        if start not in self.graph or end not in self.graph:
            return []

        all_paths = self.find_all_simple_paths(start, end, set(), [])
        path_results = []

        for path in all_paths:
            total_cost = 0.0
            total_time = 0.0
            total_scenic = 0.0
            segments = []
            
            # Walk the path segments
            for i in range(len(path) - 1):
                u = path[i]
                v = path[i+1]
                
                # Find edge matching connection
                matched_edge = None
                for edge in self.graph[u]:
                    if edge.to_city == v:
                        matched_edge = edge
                        break
                
                if matched_edge:
                    total_cost += matched_edge.cost
                    total_time += matched_edge.travel_time
                    total_scenic += matched_edge.scenic_score
                    segments.append({
                        "from": u,
                        "to": v,
                        "cost": matched_edge.cost,
                        "travel_time": matched_edge.travel_time,
                        "scenic_score": matched_edge.scenic_score,
                        "transport_mode": matched_edge.transport_mode
                    })
            
            avg_scenic = total_scenic / len(segments) if segments else 0.0
            
            # Weighted score calculation (lower is better)
            # Scale time by 100 to balance with cost magnitude
            weighted_score = (
                (total_cost * cost_weight) + 
                (total_time * 100 * time_weight) + 
                ((10 - avg_scenic) * 100 * scenic_weight)
            )

            path_results.append({
                "path": path,
                "total_cost": total_cost,
                "total_travel_time": total_time,
                "average_scenic_score": avg_scenic,
                "weighted_score": weighted_score,
                "segments": segments
            })

        # Sort paths by weighted score ascending
        path_results.sort(key=lambda x: x["weighted_score"])
        return path_results[:top_k]

# Global instance of Route Intelligence Engine
route_engine = RouteIntelligenceEngine()

def get_dynamic_routes_fallback(
    start: str,
    end: str,
    cost_weight: float = 0.4,
    time_weight: float = 0.4,
    scenic_weight: float = 0.2
) -> Dict[str, Any]:
    """Fallback dynamic route generator that works for any starting/destination cities."""
    # Normalize start/end names
    start = start.strip().title()
    end = end.strip().title()

    # Case 1: Both start and end exist in our pre-populated graph
    if start in route_engine.graph and end in route_engine.graph:
        top_paths = route_engine.get_top_routes(start, end, cost_weight, time_weight, scenic_weight)
        if top_paths:
            # Preset coordinates mapping for visual graph rendering
            coords = {
                "Delhi": (300, 100),
                "Lucknow": (480, 150),
                "Agra": (420, 180),
                "Jaipur": (240, 190),
                "Dehradun": (360, 50),
                "Srinagar": (220, 30),
                "Mumbai": (180, 280),
                "Bangalore": (320, 330),
                "Goa": (240, 320),
                "Munnar": (340, 360),
                "Udaipur": (160, 220),
                "Darjeeling": (620, 180),
                "Sikkim": (600, 160),
                "Ooty": (300, 350),
                "Manali": (320, 40),
                "Ladakh": (380, 30),
                "Gulmarg": (180, 40),
                "Nainital": (450, 80),
                "Gokarna": (260, 310),
                "Varkala": (320, 370),
                "Andaman Islands": (640, 360)
            }
            
            nodes = {}
            edges = []
            all_cities = set()
            all_segments = set()
            
            for p_opt in top_paths:
                p = p_opt["path"]
                all_cities.update(p)
                for i in range(len(p) - 1):
                    all_segments.add((p[i], p[i+1]))
            
            # Map node visual coordinates
            for idx, city in enumerate(all_cities):
                if city in coords:
                    nodes[city] = {"x": coords[city][0], "y": coords[city][1], "label": city}
                else:
                    if city == start:
                        nodes[city] = {"x": 80, "y": 200, "label": city}
                    elif city == end:
                        nodes[city] = {"x": 640, "y": 200, "label": city}
                    else:
                        ratio = (idx + 1) / (len(all_cities) + 1)
                        nodes[city] = {"x": int(80 + ratio * 560), "y": 120 + (idx % 2) * 160, "label": city}
            
            # Populate visual edges
            for u, v in all_segments:
                matched = None
                for edge in route_engine.graph.get(u, []):
                    if edge.to_city == v:
                        matched = edge
                        break
                if matched:
                    edges.append({
                        "from": u,
                        "to": v,
                        "cost": matched.cost,
                        "travel_time": matched.travel_time,
                        "scenic_score": matched.scenic_score,
                        "comfort_rating": 8,
                        "transport_mode": matched.transport_mode
                    })
            
            # Format route options
            formatted_routes = []
            for idx, p_opt in enumerate(top_paths):
                base_cost = int(p_opt["total_cost"])
                base_hotel = int(base_cost * 0.4)
                base_transit = int(base_cost * 0.45)
                mode = p_opt["segments"][0]["transport_mode"] if p_opt["segments"] else "Train"
                
                formatted_routes.append({
                    "path": p_opt["path"],
                    "cost": base_cost,
                    "time": float(p_opt["total_travel_time"]),
                    "scenic": float(p_opt["average_scenic_score"]),
                    "comfort": 8,
                    "edges": [{"from": seg["from"], "to": seg["to"]} for seg in p_opt["segments"]],
                    "platform_comparisons": {
                        "hotels": [
                            {"platform": "Booking.com", "rate": base_hotel - 180, "rating": 4.7},
                            {"platform": "MakeMyTrip", "rate": base_hotel + 120, "rating": 4.5},
                            {"platform": "Agoda", "rate": base_hotel - 80, "rating": 4.4},
                            {"platform": "Expedia", "rate": base_hotel + 240, "rating": 4.2}
                        ],
                        "transit": [
                            {"platform": "EaseMyTrip", "rate": base_transit - 140, "mode": mode},
                            {"platform": "MakeMyTrip", "rate": base_transit + 90, "mode": mode},
                            {"platform": "Yatra", "rate": base_transit + 180, "mode": mode},
                            {"platform": "ConfirmTkt" if mode == "Train" else "RedBus", "rate": base_transit - 60, "mode": mode}
                        ]
                    }
                })
            
            return {
                "start_city": start,
                "end_city": end,
                "nodes": nodes,
                "edges": edges,
                "routes": formatted_routes
            }

    # Case 2: Custom cities (fallback smart hub generation)
    is_india = any(c in start.lower() or c in end.lower() for c in ["india", "delhi", "mumbai", "lko", "lucknow", "agra", "jaipur", "dehradun", "goa", "munnar", "srinagar", "kerala", "kashmir", "bengaluru", "bangalore"])
    is_europe = any(c in start.lower() or c in end.lower() for c in ["paris", "rome", "london", "france", "italy", "uk", "prague", "swiss", "alps", "chamonix", "europe"])
    
    if is_europe:
        hub1 = "Zurich"
        hub2 = "Munich"
        hub3 = "Milan"
    elif is_india:
        hub1 = "Delhi Hub"
        hub2 = "Agra Transit"
        hub3 = "Bhopal Junction"
    else:
        hub1 = "Central Transit"
        hub2 = "Region Hub"
        hub3 = "Scenic Intersection"

    nodes = {
        start: {"x": 80, "y": 200, "label": start},
        end: {"x": 640, "y": 200, "label": end},
        hub1: {"x": 360, "y": 100, "label": hub1},
        hub2: {"x": 240, "y": 290, "label": hub2},
        hub3: {"x": 480, "y": 290, "label": hub3}
    }
    
    edges = [
        {"from": start, "to": hub1, "cost": 4200, "travel_time": 4.5, "scenic_score": 5, "comfort_rating": 8, "transport_mode": "Flight"},
        {"from": hub1, "to": end, "cost": 800, "travel_time": 1.5, "scenic_score": 6, "comfort_rating": 7, "transport_mode": "Car"},
        {"from": start, "to": hub2, "cost": 600, "travel_time": 3.5, "scenic_score": 7, "comfort_rating": 6, "transport_mode": "Train"},
        {"from": hub2, "to": hub3, "cost": 900, "travel_time": 4.0, "scenic_score": 9, "comfort_rating": 8, "transport_mode": "Train"},
        {"from": hub3, "to": end, "cost": 500, "travel_time": 2.0, "scenic_score": 8, "comfort_rating": 7, "transport_mode": "Car"},
        {"from": start, "to": hub3, "cost": 1100, "travel_time": 5.5, "scenic_score": 6, "comfort_rating": 6, "transport_mode": "Bus"},
        {"from": hub3, "to": end, "cost": 850, "travel_time": 4.5, "scenic_score": 6, "comfort_rating": 6, "transport_mode": "Bus"}
    ]
    
    routes = [
        {
            "path": [start, hub1, end],
            "cost": 5000,
            "time": 6.0,
            "scenic": 5.5,
            "comfort": 7.5,
            "edges": [{"from": start, "to": hub1}, {"from": hub1, "to": end}],
            "platform_comparisons": {
                "hotels": [
                    {"platform": "Booking.com", "rate": 1800, "rating": 4.7},
                    {"platform": "MakeMyTrip", "rate": 2100, "rating": 4.5},
                    {"platform": "Agoda", "rate": 1950, "rating": 4.4},
                    {"platform": "Expedia", "rate": 2300, "rating": 4.2}
                ],
                "transit": [
                    {"platform": "EaseMyTrip", "rate": 2200, "mode": "Flight"},
                    {"platform": "MakeMyTrip", "rate": 2350, "mode": "Flight"},
                    {"platform": "Yatra", "rate": 2450, "mode": "Flight"},
                    {"platform": "ConfirmTkt", "rate": 2150, "mode": "Flight"}
                ]
            }
        },
        {
            "path": [start, hub2, hub3, end],
            "cost": 2000,
            "time": 9.5,
            "scenic": 8.0,
            "comfort": 7.0,
            "edges": [{"from": start, "to": hub2}, {"from": hub2, "to": hub3}, {"from": hub3, "to": end}],
            "platform_comparisons": {
                "hotels": [
                    {"platform": "Booking.com", "rate": 720, "rating": 4.6},
                    {"platform": "MakeMyTrip", "rate": 850, "rating": 4.3},
                    {"platform": "Agoda", "rate": 790, "rating": 4.1},
                    {"platform": "Expedia", "rate": 920, "rating": 4.0}
                ],
                "transit": [
                    {"platform": "RedBus", "rate": 840, "mode": "Train"},
                    {"platform": "MakeMyTrip", "rate": 950, "mode": "Train"},
                    {"platform": "Yatra", "rate": 990, "mode": "Train"},
                    {"platform": "ConfirmTkt", "rate": 810, "mode": "Train"}
                ]
            }
        },
        {
            "path": [start, hub3, end],
            "cost": 1950,
            "time": 10.0,
            "scenic": 6.0,
            "comfort": 6.0,
            "edges": [{"from": start, "to": hub3}, {"from": hub3, "to": end}],
            "platform_comparisons": {
                "hotels": [
                    {"platform": "Booking.com", "rate": 680, "rating": 4.5},
                    {"platform": "MakeMyTrip", "rate": 800, "rating": 4.2},
                    {"platform": "Agoda", "rate": 720, "rating": 4.1},
                    {"platform": "Expedia", "rate": 880, "rating": 3.9}
                ],
                "transit": [
                    {"platform": "RedBus", "rate": 880, "mode": "Bus"},
                    {"platform": "AbhiBus", "rate": 850, "mode": "Bus"},
                    {"platform": "MakeMyTrip", "rate": 990, "mode": "Bus"},
                    {"platform": "Goibibo", "rate": 930, "mode": "Bus"}
                ]
            }
        }
    ]
    
    return {
        "start_city": start,
        "end_city": end,
        "nodes": nodes,
        "edges": edges,
        "routes": routes
    }

async def get_dynamic_routes(
    start: str,
    end: str,
    cost_weight: float = 0.4,
    time_weight: float = 0.4,
    scenic_weight: float = 0.2,
    api_key: str = None
) -> Dict[str, Any]:
    start = start.strip().title()
    end = end.strip().title()
    active_key = api_key or settings.GROQ_API_KEY
    if not active_key:
        logger.warning("GROQ_API_KEY not configured. Falling back to dynamic mock route generator.")
        return get_dynamic_routes_fallback(start, end, cost_weight, time_weight, scenic_weight)
        
    try:
        client = Groq(api_key=active_key)
        prompt = f"""
        You are the Route Intelligence Agent for VoyageIQ.
        The user wants to travel from '{start}' to '{end}'.
        Generate 3 alternative travel routes between '{start}' and '{end}'.
        Propose a path of intermediate cities or major transit hubs for each route.

        Respond ONLY in raw JSON format with the following keys:
        1. "nodes": A dictionary mapping each unique city name in any of the paths to an object with "x", "y", and "label".
           - "x" must be an integer between 80 and 640 representing horizontal visual coordinate.
           - "y" must be an integer between 60 and 320 representing vertical visual coordinate.
           - "label" is the city name.
           - Ensure the starting city '{start}' has x=80, y=200, and the destination '{end}' has x=640, y=200, so they align on opposite sides of the graph. Distribute the intermediate cities visually between them.
        2. "edges": A list of all unique connections between the cities in any of the paths. Each connection must contain:
           - "from": Starting city of the segment
           - "to": Ending city of the segment
           - "cost": Estimated travel cost in INR (integer, e.g. 1500)
           - "travel_time": Travel duration in hours (float, e.g. 4.5)
           - "scenic_score": Score from 1 to 10
           - "comfort_rating": Score from 1 to 10
           - "transport_mode": One of "Flight", "Train", "Bus", "Car"
        3. "routes": A list of 3 route alternatives sorted by suitability. Each route contains:
           - "path": A list of city names in order, e.g. ["{start}", "Hub A", "{end}"]
           - "cost": Total cost in INR (integer)
           - "time": Total duration in hours (float)
           - "scenic": Average scenic score (1-10)
           - "comfort": Average comfort rating (1-10)
           - "edges": A list of segment connections, e.g. [{"from": "{start}", "to": "Hub A"}, {"from": "Hub A", "to": "{end}"}]
           - "platform_comparisons": A dictionary comparing booking platforms for this route containing:
             * "hotels": A list of objects with "platform" (e.g. Booking.com, MakeMyTrip, Agoda, Expedia), "rate" (price in INR per night as integer), and "rating" (1-5 scale as float)
             * "transit": A list of objects with "platform" (e.g. EaseMyTrip, MakeMyTrip, RedBus, ConfirmTkt), "rate" (ticket price in INR as integer), and "mode" (Flight/Train/Bus)

        Ensure that the routes actually form valid paths from '{start}' to '{end}'.
        Ensure the output is raw JSON only. Do not enclose in markdown blocks.
        """

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system", 
                    "content": "You are a route calculation assistant that outputs structured travel JSON."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        raw_response = chat_completion.choices[0].message.content
        return json.loads(raw_response)
    except Exception as e:
        logger.error(f"Groq Route Generation failed: {str(e)}. Falling back to dynamic mock route generator.")
        return get_dynamic_routes_fallback(start, end, cost_weight, time_weight, scenic_weight)
