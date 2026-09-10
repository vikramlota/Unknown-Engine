import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Dict, Any

def generate_hypothesis_node(state: Dict[str, Any]) -> Dict[str, Any]:
    print("-> Querying Gemini for plausibility hypotheses...")
    
    # Extract the significant pairs that survived FDR correction
    # Depending on your graph wiring, this might come from symbolic_results or corrected_pairs
    candidates = state.get("corrected_pairs", [])
    hypotheses = []

    # TRD NFR-6: System must degrade gracefully if the API is unreachable[cite: 4]
    try:
        # Initialize Gemini (temperature 0.3 to reduce run-to-run wording variance)[cite: 4]
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash", 
            temperature=0.3 
        )
        
        # TRD NFR-5: Explicitly instruct the output to state plausibility, not certainty[cite: 4]
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an astrophysics assistant. Briefly explain the physical plausibility of a relationship between two variables. Explicitly state this is a hypothesis, not a confirmed finding."),
            ("human", "Variable 1: {var1}\nVariable 2: {var2}\nCorrelation: {score}\nGenerate a 2-sentence hypothesis.")
        ])
        
        chain = prompt | llm
        
        for candidate in candidates:
            # Copy the candidate data so we don't mutate the original dictionary directly
            cand_data = candidate.copy()
            
            response = chain.invoke({
                "var1": cand_data.get("var1"),
                "var2": cand_data.get("var2"),
                "score": cand_data.get("score")
            })
            
            cand_data["hypothesis_text"] = response.content
            hypotheses.append(cand_data)
            
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Fallback to prevent pipeline crash[cite: 4]
        for candidate in candidates:
            cand_data = candidate.copy()
            cand_data["hypothesis_text"] = "Hypothesis generation unavailable"
            hypotheses.append(cand_data)

    return {"hypotheses": hypotheses}