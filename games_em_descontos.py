import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
import time
import os

# URL do seu Webhook no Discord
WEBHOOK_URL = os.getenv("GAMES_WEBHOOK_URL")

# Função para buscar promoções da Epic Games usando Selenium
def buscar_promocoes_epic():
    url = "https://store.epicgames.com/pt-BR/browse?sortBy=discount&sortDir=DESC"
    
    # Configuração do Selenium
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Executa em modo headless (sem interface gráfica)
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
    
    # Inicializa o driver sem especificar o caminho (depende do PATH)
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        driver.get(url)
        time.sleep(5)  # Aguarda o carregamento do conteúdo dinâmico
        
        jogos_em_promocao = []
        jogos = driver.find_elements(By.CSS_SELECTOR, ".css-1qwlcgg")[:10]  # Limita a 10 jogos
        
        for jogo in jogos:
            try:
                nome = jogo.find_element(By.CSS_SELECTOR, ".css-rgqwpc").text.strip()
                preco = jogo.find_element(By.CSS_SELECTOR, ".css-119zqif").text.strip()
                link = jogo.find_element(By.CSS_SELECTOR, "a").get_attribute("href")
                
                jogos_em_promocao.append(
                    f"🎮 [{nome}]({link})\n💰 {preco}\n"
                )
            except Exception as e:
                print(f"Erro ao processar jogo da Epic Games: {e}")
        
        return jogos_em_promocao
    except Exception as e:
        print(f"Erro ao buscar promoções da Epic Games: {e}")
        return ["⚠️ Erro ao buscar promoções."]
    finally:
        driver.quit()

# Função para enviar promoções ao Discord
def enviar_promocoes_discord():
    promocoes_epic = buscar_promocoes_epic()
    
    if promocoes_epic:
        mensagem = "🌟 **Promoções da Epic Games** 🌟\n\n" + "\n".join(promocoes_epic[:10])  # Limita a 10 promoções
        
        data = {"content": mensagem}
        response = requests.post(GAMES_WEBHOOK_URL, json=data)
        if response.status_code != 204:  # Verifica se a mensagem foi enviada com sucesso
            print(f"Erro ao enviar mensagem para o Discord: {response.status_code}, {response.text}")
    else:
        print("Nenhuma promoção encontrada para enviar.")

# Executar o script
if __name__ == "__main__":
    enviar_promocoes_discord()