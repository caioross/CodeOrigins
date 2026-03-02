import json

# Abre o arquivo JSON
with open("en.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Usa um set para armazenar as categorias sem duplicatas
categories = set()

for item in data:
    if "category" in item:
        categories.add(item["category"])

# Converte o set para uma lista ordenada e exibe
sorted_categories = sorted(list(categories))

print("Categorias encontradas:")
for category in sorted_categories:
    print(f"- {category}")