import matplotlib.pyplot as plt
import re

with open('./Datos/datos.txt','r') as f:
    tiempos = []
    
    for line in f.readlines():
        values = re.split(r'\s+', line)
        for value in values:
            if value:
                tiempos.append(float(value))
consultas = list(range(1, len(tiempos) + 1))

# crear el gráfico de barras
plt.bar(consultas, tiempos)


plt.xlabel('consultas')
plt.ylabel('tiempos de ejecucion')
plt.title('Grafico de tiempos de ejecucion de cada consulta')
plt.show()