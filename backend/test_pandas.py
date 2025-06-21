#!/usr/bin/env python3
import sys
import os

print("Python executable:", sys.executable)
print("Python path:", sys.path)
print("Current directory:", os.getcwd())

try:
    import pandas as pd
    print("✅ pandas importado com sucesso!")
    print("Versão do pandas:", pd.__version__)
except ImportError as e:
    print("❌ Erro ao importar pandas:", e)

try:
    import numpy as np
    print("✅ numpy importado com sucesso!")
except ImportError as e:
    print("❌ Erro ao importar numpy:", e) 