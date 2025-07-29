import matplotlib.pyplot as plt


def visualize_basic_infra(df_resultado):
    plt.figure(figsize=(12, 8))

    plt.barh(df_resultado["Item"], df_resultado["Faltam (%)"])

    plt.title("Porcentagem de escolas públicas da paraíba sem esses itens")

    plt.xlabel("Porcentagem de escolas sem o item")

    plt.show()
