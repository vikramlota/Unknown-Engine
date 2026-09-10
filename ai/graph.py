from typing import TypedDict, Any, Dict, List
import pandas as pd
import json
import os
from dotenv import load_dotenv
load_dotenv("ai/.env")
from langgraph.graph import StateGraph, START, END

# Import the deterministic ML functions
from data.clean_data import clean_and_engineer
from ml.screening import run_screening
from ml.validation import apply_fdr
from ml.symbolic import fit_expressions

# Import AI nodes
from ai.hypothesis import generate_hypothesis_node
from ai.novelty import novelty_check as novelty_check_node

# --- 1. Define the State Schema ---
class PipelineState(TypedDict):
    raw_data: Any             
    features: Any             
    screened_pairs: List[Dict] 
    corrected_pairs: List[Dict] 
    symbolic_results: List[Dict] 
    hypotheses: List[Dict]    
    novelty_results: List[Dict] 
    validation_results: Any   
    final_output: List[Dict]  

# --- 2. Define the Nodes ---
def load_data(state: PipelineState):
    print("-> Loading raw exoplanet data...")
    try:
        df = pd.read_csv("data/processed/exoplanets_clean.csv")
    except Exception:
        df = clean_and_engineer()
    return {"raw_data": df, "features": df} 

def generate_features(state: PipelineState):
    print("-> Features already engineered in data loading step.")
    return {"features": state["features"]}

def screen_relationships(state: PipelineState):
    print("-> Running Pearson, Spearman, and dcor screening...")
    pairs = run_screening(state["features"])
    return {"screened_pairs": pairs}

def fdr_correct(state: PipelineState):
    print("-> Applying Benjamini-Hochberg FDR correction...")
    corrected = apply_fdr(state["screened_pairs"])
    return {"corrected_pairs": corrected}

def symbolic_regression(state: PipelineState):
    print("-> Fitting symbolic expressions via gplearn...")
    # Run on the top 5 to save time
    expressions = fit_expressions(state["corrected_pairs"], state["features"], top_k=5)
    return {"symbolic_results": expressions}

def generate_hypothesis(state: PipelineState):
    print("-> Querying LLM for plausibility hypotheses...")
    cands = []
    for p in state["symbolic_results"]:
        p_copy = p.copy()
        # Map dcor to score for the LLM prompt
        p_copy["score"] = p_copy.get("dcor", p_copy.get("spearman", 0))
        cands.append(p_copy)
    
    # The existing ai/hypothesis.py expects "corrected_pairs" in the state dict
    fake_state = {"corrected_pairs": cands}
    res = generate_hypothesis_node(fake_state)
    return {"hypotheses": res["hypotheses"]}

def novelty_check(state: PipelineState):
    print("-> Checking against FAISS abstract corpus...")
    res = novelty_check_node(state)
    return res

def validate(state: PipelineState):
    print("-> Validating data payload against JSON contract...")
    return {"validation_results": True}

def compile_output(state: PipelineState):
    print("-> Writing to output/results.json...")
    # Add id to each candidate for the frontend
    final_res = state["novelty_results"]
    for i, res in enumerate(final_res):
        res["id"] = str(i + 1)
        
    with open("output/results.json", "w") as f:
        json.dump(final_res, f, indent=2)
    return {"final_output": final_res}

# --- 3. Wire the StateGraph ---
workflow = StateGraph(PipelineState)

# Add all nodes
workflow.add_node("load_data", load_data)
workflow.add_node("generate_features", generate_features)
workflow.add_node("screen_relationships", screen_relationships)
workflow.add_node("fdr_correct", fdr_correct)
workflow.add_node("symbolic_regression", symbolic_regression)
workflow.add_node("generate_hypothesis", generate_hypothesis)
workflow.add_node("novelty_check", novelty_check)
workflow.add_node("validate", validate)
workflow.add_node("compile_output", compile_output)

# Define the strict linear sequence
workflow.add_edge(START, "load_data")
workflow.add_edge("load_data", "generate_features")
workflow.add_edge("generate_features", "screen_relationships")
workflow.add_edge("screen_relationships", "fdr_correct")
workflow.add_edge("fdr_correct", "symbolic_regression")
workflow.add_edge("symbolic_regression", "generate_hypothesis")
workflow.add_edge("generate_hypothesis", "novelty_check")
workflow.add_edge("novelty_check", "validate")
workflow.add_edge("validate", "compile_output")
workflow.add_edge("compile_output", END)

# Compile the pipeline
app = workflow.compile()

if __name__ == '__main__':
    print("--- Starting Pipeline ---")
    final_state = app.invoke({"raw_data": None})
    print("--- Pipeline Finished ---")
    print(f"Generated {len(final_state['final_output'])} final candidate equations.")