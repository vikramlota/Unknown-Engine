import os
import json
import numpy as np
from typing import Dict, Any

def novelty_check(state: Dict[str, Any]) -> Dict[str, Any]:
    print("-> (Stretch) Checking against FAISS abstract corpus...")
    
    # Retrieve candidates coming out of the hypothesis generation step
    candidates = state.get("hypotheses", [])
    if not candidates:
        return {"novelty_results": []}

    abstracts_path = "data/abstracts.json"
    
    # Graceful fallback: Skip FAISS check if corpus isn't built yet
    if not os.path.exists(abstracts_path):
        print(f"Skipping novelty check: {abstracts_path} not found.")
        return {"novelty_results": candidates}
        
    try:
        # Import inside the try-block in case dependencies are missing on run
        from sentence_transformers import SentenceTransformer
        import faiss
        
        # Load the RAG corpus[cite: 4]
        with open(abstracts_path, "r", encoding="utf-8") as f:
            corpus = json.load(f)
            
        if not corpus:
            raise ValueError("Abstracts corpus is empty")
            
        abstract_texts = [item["abstract"] for item in corpus]
        
        # Initialize embedding model required by TRD[cite: 4]
        model = SentenceTransformer("all-MiniLM-L6-v2")
        
        # Embed the corpus abstracts into dense vectors[cite: 4]
        corpus_embeddings = model.encode(abstract_texts, convert_to_numpy=True)
        
        # Initialize FAISS exact-match index[cite: 4]
        dimension = corpus_embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(corpus_embeddings)
        
        enriched_candidates = []
        for cand in candidates:
            cand_data = cand.copy()
            hypothesis_text = cand_data.get("hypothesis_text", "")
            
            # Only run semantic search if a valid hypothesis exists
            if hypothesis_text and hypothesis_text != "Hypothesis generation unavailable":
                query_embedding = model.encode([hypothesis_text], convert_to_numpy=True)
                
                # Retrieve the distance to the single nearest neighbor (k=1)
                distances, indices = index.search(query_embedding, 1)
                nearest_distance = float(distances[0][0])
                
                # A higher distance means the candidate is further from known literature[cite: 4]
                cand_data["novelty_distance"] = nearest_distance
            else:
                cand_data["novelty_distance"] = None
                
            enriched_candidates.append(cand_data)
            
        return {"novelty_results": enriched_candidates}
        
    except Exception as e:
        print(f"Novelty Check Error: {e}")
        # Return unmodified candidates so the final results.json still compiles
        return {"novelty_results": candidates}