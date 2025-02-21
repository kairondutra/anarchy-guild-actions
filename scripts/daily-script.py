import requests
from datetime import datetime
import pytz
import os

# Configuração do webhook do Discord
WEBHOOK_URL = os.getenv("DISCORD_WEBHOOK_URL")

# Mapeamento de dias da semana para cidades (corrigido)
local_npc_merchant = {
    0: "Pewter",     # Segunda-feira
    1: "Viridian",   # Terça-feira
    2: "Fuchsia",    # Quarta-feira
    3: "Cinnabar",   # Quinta-feira
    4: "Pallet",     # Sexta-feira
    5: "Lavender",   # Sábado
    6: "Cerulean"    # Domingo
}

local_npc_duke = {
    0: "Lavender",     # Segunda-feira
    1: "Cerulean",   # Terça-feira
    2: "Fuchsia",    # Quarta-feira
    3: "Cinnabar",   # Quinta-feira
    4: "Viridian",     # Sexta-feira
    5: "Pallet",   # Sábado
    6: "Pewter"    # Domingo
}

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

def verificar_localizacao_npc():
    """Verifica a localização do NPC com base no dia da semana e envia a mensagem no Discord."""
    
    # Configurar fuso horário para Brasília
    fuso_brasilia = pytz.timezone("America/Sao_Paulo")
    dia_semana = datetime.now(fuso_brasilia).weekday()  # 0 = Domingo, 6 = Sábado

    merchant_cidade = local_npc_merchant.get(dia_semana, "Local desconhecido")
    duke_cidade = local_npc_duke.get(dia_semana, "Local desconhecido")

    mensagem = (
        f"🌍 **Localização dos NPC Fixos hoje** 🌍\n\n"
        f"> 🏙️ **NPC Merchant:** {merchant_cidade}\n\n"
        f"> 🏙️ **NPC The Duke:** {duke_cidade}\n\n"
        f"📢 Eles ficarão nessas localidades até o SS do dia seguinte!"
    )
    
    enviar_mensagem_discord(mensagem)

# Executar a verificação manualmente
verificar_localizacao_npc()