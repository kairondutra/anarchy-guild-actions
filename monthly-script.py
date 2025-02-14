import requests
from datetime import datetime
import os

# Configuração do webhook do Discord
WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")

# Validar se o webhook está configurado
if not WEBHOOK_URL:
    print("Erro: A variável de ambiente DISCORD_WEBHOOK_URL não está configurada.")
    exit(1)

# Dados de eventos por mês
eventos = [
    {"mes": 1, "nome": "Janeiro", "mensagem": "Troca de Profissão."},
    {"mes": 2, "nome": "Fevereiro", "mensagem": "Troca de Clã."},
    {"mes": 3, "nome": "Março", "mensagem": "Troca de Profissão."},
    {"mes": 4, "nome": "Abril", "mensagem": "Nenhuma promoção neste mês."},
    {"mes": 5, "nome": "Maio", "mensagem": "Troca de Clã."},
    {"mes": 6, "nome": "Junho", "mensagem": "Troca de Profissão."},
    {"mes": 7, "nome": "Julho", "mensagem": "Troca de Clã."},
    {"mes": 8, "nome": "Agosto", "mensagem": "Troca de Profissão."},
    {"mes": 9, "nome": "Setembro", "mensagem": "Troca de Clã."},
    {"mes": 10, "nome": "Outubro", "mensagem": "Troca de Profissão."},
    {"mes": 11, "nome": "Novembro", "mensagem": "Nenhuma promoção neste mês."},
    {"mes": 12, "nome": "Dezembro", "mensagem": "Troca de Clã."},
]

def enviar_mensagem_discord(mensagem):
    """Envia uma mensagem para o webhook do Discord."""
    data = {"content": mensagem}
    try:
        response = requests.post(WEBHOOK_URL, json=data)
        if response.status_code == 204:
            print("Mensagem enviada com sucesso!\n")
        else:
            print(f"Erro ao enviar mensagem: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Erro de conexão ao enviar mensagem: {e}")

def obter_evento_por_mes(mes):
    """Retorna o evento correspondente ao mês fornecido."""
    for evento in eventos:
        if evento["mes"] == mes:
            return evento
    return {"mensagem": "Nenhuma promoção neste mês."}

def verificar_eventos():
    """Verifica o evento do mês atual e o próximo e envia notificação."""
    mes_atual = datetime.now().month
    proximo_mes_numero = mes_atual + 1 if mes_atual < 12 else 1

    # Obter eventos
    evento_atual = obter_evento_por_mes(mes_atual)
    evento_proximo = obter_evento_por_mes(proximo_mes_numero)

    # Montar a mensagem
    mensagem = (
        f":gem: **Promoções do Mês** :gem:\n\n"
        f"> **Mês Atual ({evento_atual['nome']}):**\n"
        f"> *{evento_atual['mensagem']}*\n\n"
        f"> **Próximo Mês ({evento_proximo['nome']}):**\n"
        f"> *{evento_proximo['mensagem']}*\n\n"
        f"📢 Para mais informações, consulte o [post oficial](https://discord.com/channels/459138221914193921/1243259802822643752)."
    )

    enviar_mensagem_discord(mensagem)

if __name__ == "__main__":
    verificar_eventos()