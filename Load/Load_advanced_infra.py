
import matplotlib.pyplot as plt

def visualize_advanced_infra(df_resultado):
    plt.figure(figsize=(12,8))

    plt.barh(df_resultado['Item'], df_resultado['Com (%)'])

    plt.title("Porcentagem de escolas com esses itens")

    plt.xlabel("Porcentagem de escolas com o item")

    plt.show()
