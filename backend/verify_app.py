import sys
import os

# Add root folder to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    print("VoyageIQ Diagnostics")
    print("==================================================")
    
    # Try importing FastAPI app
    from app.main import app
    print("FastAPI Application loaded successfully!")
    print("Registered routes:")
    for route in app.routes:
        if hasattr(route, "path"):
            path = route.path
            methods = getattr(route, "methods", None)
            methods_str = f" [{', '.join(methods)}]" if methods else ""
            print(f"  {path:<40} {methods_str}")
        else:
            print(f"  {str(route):<40}")
    print("==================================================")
    
    # Try importing LangGraph app
    from app.agents.graph import journey_graph
    print("LangGraph compiled successfully!")
    print("Registered graph nodes:")
    print("  " + ", ".join(journey_graph.nodes.keys()))
    print("==================================================")

    # Try importing Route Engine
    from app.services.route_intelligence import route_engine
    print("Route Intelligence Engine initialized successfully!")
    print("Prepopulated cities in network:")
    print("  " + ", ".join(route_engine.graph.keys()))
    print("Test Routing Query: Lucknow -> Dehradun (Top 3 options):")
    top_routes = route_engine.get_top_routes("Lucknow", "Dehradun", cost_weight=0.4, time_weight=0.4, scenic_weight=0.2)
    for idx, route in enumerate(top_routes, 1):
        path_str = " -> ".join(route["path"])
        print(f"  Route #{idx}: {path_str} (Cost: {route['total_cost']}, Time: {route['total_travel_time']}h, Scenic Score: {route['average_scenic_score']:.1f}, Combined Score: {route['weighted_score']:.1f})")
    print("==================================================")

    # Try importing Recommendation Engine
    from app.services.recommendation import generate_recommendations
    import asyncio
    print("AI Recommendation Engine loaded successfully!")
    print("Test AI Recommendation Query (Mock Heuristics Fallback):")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    rec_result = loop.run_until_complete(
        generate_recommendations(
            questionnaire={"weather": "warm", "activities": ["beach", "surfing"]},
            budget="Budget",
            duration=5,
            travel_history=["London"]
        )
    )
    print("  Match Scores:")
    for dest, score in rec_result["match_scores"].items():
        print(f"    {dest}: {score}/100")
    print("  Top Recommended Destinations:")
    for rec in rec_result["top_recommendations"]:
        print(f"    - {rec['destination']}: {rec['reason']}")
    print("  Alternative Destinations:")
    print("    " + ", ".join(rec_result["alternative_destinations"]))
    print("  Personalized Insights:")
    for insight in rec_result["personalized_insights"]:
        print(f"    - {insight}")
    print("==================================================")
    print("STATUS: All systems initialized correctly!")
    
except Exception as e:
    print("DIAGNOSTICS FAILED:", e)
    sys.exit(1)
