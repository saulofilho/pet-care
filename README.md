# 🐾 AuAu Care & Social Dog

> **O ecossistema completo para a saúde, bem-estar e socialização do seu cão.**  
> Aplicativo web moderno e responsivo com Prontuário Digital Centralizado, Agenda Inteligente de Vacinação e Vermifugação, Mapa Interativo de Pet Shops e Adestradores, Rede Social de Cães, Encontros nos Parques, Marketplace Pet, Sistema de Recompensas Gamificado e Chat Veterinário de Plantão 24h.

---

## ✨ Funcionalidades Principais

### 🩺 1. Prontuário Digital & Histórico Médico Centralizado
- **Centralização de Saúde**: Histórico completo de consultas clínicas, exames laboratoriais (sangue, raio-x, ultrassom) e cirurgias.
- **Alergias & Contraindicações**: Registro com níveis de gravidade (leve, moderada, severa/anafilática) e alertas automáticos.
- **Curva de Peso Corporal**: Gráfico visual do histórico de pesagens com acompanhamento de evolução.
- **Medicamentos Contínuos**: Horários e dosagens para tratamentos crônicos.
- **Exportação & Impressão**: Prontuário pronto para impressão ou compartilhamento em PDF com hospitais e clínicas.

### 🚨 2. Ficha SOS de Emergência Rápida
- Botão de acesso instantâneo aos dados vitais do animal em situações críticas (alergias graves, medicamentos proibidos, tipo sanguíneo, microchip).
- Ligação direta em 1 clique e rota GPS para o **Hospital Veterinário 24h** cadastrado.
- QR Code Pet ID para leitura rápida por qualquer médico veterinário.

### 💉 3. Agenda de Vacinação & Vermifugação com Alertas
- Gestão de vacinas essenciais (V8/V10, Antirrábica) e complementares (Gripe Canina, Giárdia, Leishmaniose).
- Lembretes automáticos com contagem regressiva e alertas de doses próximas ou vencidas.
- Controle de vermífugos e antipulgas/carrapatos periódicos (Bravecto, Simparic, Nexgard, Drontal).
- Registro de lote, clínica e CRMV do veterinário responsável.

### 📍 4. Mapa de Pet Shops, Clínicas 24h & Adestradores Profissionais
- Mapa interativo com raio de busca configurável (1km a 25km).
- Filtros por categoria: Pet Shops, Clínicas 24h, Adestradores Certificados e Parques Pet Friendly.
- **Módulo de Adestradores Profissionais**: Consulta de especialidades (ansiedade de separação, obediência básica, reatividade, filhotes), certificações, valor por hora e agendamento de avaliação.
- Botões diretos para WhatsApp e rota GPS via Google Maps.

### 🐕 5. Rede Social & Encontros no Parque (Cãomunidade)
- **Feed Social**: Compartilhamento de fotos, conquistas, curtidas ("aumigos curtiram") e comentários.
- **Organizador de Encontros (Dog Playdates)**: Criação e descoberta de encontros em parques locais (ex: Parque Ibirapuera, Villa-Lobos, etc.).
- Confirmação de presença (RSVP), lista de participantes e filtros por porte/raça.

### 🛍️ 6. Marketplace de Rações, Brinquedos & Farmácia
- Catálogo de Rações Super Premium, Brinquedos Interativos KONG, Petiscos Naturais e Farmácia Veterinária.
- Carrinho de compras dinâmico com cálculo de frete grátis e aplicação de cupons.
- Simulação de checkout com geração de pontos de cashback em AuCoins.

### 🏆 7. Sistema de Recompensas & Gamificação (AuCoins)
- Acúmulo de pontos cuidando da saúde do cão (vacinas em dia, check-in em parques, compras).
- Níveis de fidelidade: **Bronze**, **Prata**, **Ouro** e **Diamante**.
- Missões diárias e ofensiva de dias consecutivos.
- Resgate de cupons reais (ex: 15% OFF em rações, Banho Grátis, 50% em sessões de adestramento).

### 💬 8. Chat Direto com Veterinários de Plantão 24/7
- Teleorientação veterinária com triagem por níveis de gravidade (Verde, Amarelo e Vermelho).
- Recomendações clínicas imediatas e condutas de primeiros socorros.
- Botão para **salvar o atendimento direto no Prontuário Digital do Pet**.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Animações & Efeitos**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Persistência**: LocalStorage com arquitetura de fallback e reatividade instantânea

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js**: Versão **20.0.0 ou superior** (`node -v`)
- **npm**: Versão **10.0.0 ou superior** (`npm -v`)

### Passo a Passo:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/auau-care-dog-app.git
   cd auau-care-dog-app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. Abra seu navegador no endereço:
   ```
   http://localhost:3000
   ```

---

## 🌐 Deploy no GitHub Pages (Node > 20)

Este projeto já vem 100% configurado para deploy contínuo no **GitHub Pages** através do **GitHub Actions**.

### 1. Configurar o Repositório no GitHub:
1. No seu repositório no GitHub, vá em **Settings** > **Pages**.
2. Na seção **Build and deployment**, em **Source**, selecione **GitHub Actions**.

### 2. Publicação Automática:
Sempre que fizer um `push` na branch `main` ou `master`, o workflow localizado em `.github/workflows/deploy.yml` executará automaticamente o build estático com **Node 20+** e publicará sua aplicação no GitHub Pages:
```
https://<seu-usuario>.github.io/<nome-do-repositorio>/
```

### 3. Build Manual:
Se preferir gerar o pacote de produção estático localmente:
```bash
npm run build
```
Os arquivos otimizados serão gerados dentro do diretório `/dist`.

---

## 📁 Estrutura de Pastas

```
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD para deploy automático no GitHub Pages (Node 20+)
├── src/
│   ├── components/
│   │   ├── Navbar.tsx            # Navegação principal e atalhos rápidos
│   │   ├── PetProfileHeader.tsx  # Troca de pets e resumo de saúde
│   │   ├── VaccineSchedule.tsx   # Agenda de vacinação e vermifugação
│   │   ├── MedicalRecord.tsx     # Prontuário digital e histórico de exames
│   │   ├── NearbyMap.tsx         # Mapa de pet shops e adestradores
│   │   ├── SocialParkMeetups.tsx # Rede social e encontros nos parques
│   │   ├── Marketplace.tsx       # Loja pet e carrinho de compras
│   │   ├── RewardsSystem.tsx     # Sistema de recompensas e AuCoins
│   │   ├── Vet24hChat.tsx        # Chat com veterinários de plantão
│   │   └── SosEmergencyModal.tsx # Ficha SOS e acesso rápido de emergência
│   ├── services/
│   │   └── storage.ts            # Serviço de persistência local
│   ├── types.ts                  # Definições de tipos TypeScript
│   ├── mockData.ts               # Dados iniciais realistas
│   ├── App.tsx                   # Componente raiz da aplicação
│   ├── index.css                 # Estilos globais Tailwind CSS
│   └── main.tsx                  # Ponto de entrada React 19
├── metadata.json                 # Metadados do projeto
├── package.json                  # Dependências e scripts
├── tsconfig.json                 # Configurações TypeScript
├── vite.config.ts                # Configuração do Vite com base relativa
└── README.md                     # Documentação completa do projeto
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja `LICENSE` para mais informações.
