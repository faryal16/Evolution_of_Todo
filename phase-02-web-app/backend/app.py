from src.main import app

# Gradio or FastAPI app object for Hugging Face Spaces
# The app object is imported from the main module

# This can be run with uvicorn for local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)