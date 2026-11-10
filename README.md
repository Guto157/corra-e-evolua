# Corra e Evolua

Jogo idle de corrida lateral automática. O personagem corre sozinho em perfil, enquanto o jogador acompanha distância, velocidade, moedas, experiência e evolução.

## Sistema atual
- Escolha entre personagem masculino e feminino.
- Corrida lateral automática com animação de passada.
- Energia máxima de 15 pontos.
- Cada nova corrida consome exatamente 1 ponto de energia.
- Recuperação automática de 1 ponto a cada 5 minutos, inclusive com o jogo fechado, limitada a 15.
- Corridas podem ser iniciadas novamente sempre que houver energia.
- Moedas, XP, níveis, distância total e recorde são salvos no navegador.
- Melhorias de distância e tênis equipáveis aumentam o resultado de cada corrida.
- Estrutura modular para futuras atualizações sem apagar o progresso salvo.

## Testar
https://guto157.github.io/corra-e-evolua/

## Estrutura
- `core/`: regras centrais, jogador, economia, itens e salvamento.
- `js/`: interface e renderização.
- `updates/`: módulos opcionais de futuras atualizações.
- `css/`: aparência responsiva.

## Próximas expansões
Veículos, missões, loja premium, anúncios e sincronização em nuvem serão integrados em módulos separados, preservando o núcleo e o progresso atual.
