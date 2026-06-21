from langgraph.graph import StateGraph, START, END
from app.agents.state import AgentState
from app.agents.nodes import (
    preference_agent_node,
    destination_agent_node,
    weather_agent_node,
    route_agent_node,
    budget_agent_node,
    itinerary_agent_node
)

# Define state graph pipeline
workflow = StateGraph(AgentState)

# Register nodes
workflow.add_node("preference_agent", preference_agent_node)
workflow.add_node("destination_agent", destination_agent_node)
workflow.add_node("weather_agent", weather_agent_node)
workflow.add_node("route_agent", route_agent_node)
workflow.add_node("budget_agent", budget_agent_node)
workflow.add_node("itinerary_agent", itinerary_agent_node)

# Create execution links (Edges)
workflow.add_edge(START, "preference_agent")
workflow.add_edge("preference_agent", "destination_agent")

# Branch parallel executions
workflow.add_edge("destination_agent", "weather_agent")
workflow.add_edge("destination_agent", "route_agent")
workflow.add_edge("destination_agent", "budget_agent")

# Merge parallel branches back into Itinerary Compiler
workflow.add_edge("weather_agent", "itinerary_agent")
workflow.add_edge("route_agent", "itinerary_agent")
workflow.add_edge("budget_agent", "itinerary_agent")

# Terminal node
workflow.add_edge("itinerary_agent", END)

# Compile the graph
journey_graph = workflow.compile()
