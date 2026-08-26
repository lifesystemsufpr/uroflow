# UroFlow Kids

**UroFlow Kids** é um aplicativo web (SPA - Single Page Application) moderno e dinâmico voltado para a saúde digital pediátrica. Seu propósito principal é permitir que pais e responsáveis acompanhem e registrem de forma intuitiva eventos urinários e intestinais de suas crianças, facilitando o acompanhamento uropediátrico e o registro de rotinas diárias.

## 🎯 Filosofia do Produto

A arquitetura de UX do UroFlow Kids é centrada na relação de **Um Responsável para Várias Crianças**. O aplicativo reconhece que os pais podem precisar acompanhar mais de um filho simultaneamente. Assim, todo o modelo de dados, interface e fluxo de navegação foram projetados para garantir o **isolamento total** de informações. A experiência também rejeita a ideia de um "app médico frio"; a identidade visual, as micro-animações e o tom de voz buscam criar um ambiente amigável e focado no bem-estar, com uma interface *premium*.

O aplicativo não substitui diagnósticos, prescrições médicas ou integração com planos de saúde, mas atua como um companheiro diário e um valioso apoio à memória dos pais.

## ✨ Principais Funcionalidades

O sistema é dividido em quatro telas principais acessadas pela barra de navegação inferior (Bottom Nav):

### 1. Painel (Dashboard)
A tela inicial exibe um resumo do dia da criança ativa. O painel inclui um sistema dinâmico de cards que totalizam eventos (como quantidade de Xixis, Ingestão de Água, Evacuações e Escapes) e oferece botões rápidos e visuais para lançar novos registros ao longo do dia através de formulários (Wizards) focados e lúdicos.

### 2. Consultas
Muito mais do que uma agenda, a aba Consultas funciona como **Agenda + Memória do Responsável**. Esta área permite:
- **Próximas consultas e Consultas anteriores**: Visualização das datas e informações importantes.
- **Considerações para a próxima consulta**: Uma área onde os pais podem anotar dúvidas, sintomas ou perguntas que desejam fazer ao pediatra/urologista, para que nada seja esquecido no calor do momento.

### 3. Diário
Uma timeline cronológica e visual de todos os eventos registrados no dia, permitindo ao usuário filtrar por categorias (`Todos`, `Xixi`, `Água`, `Cocô`, `Escape`, `Noite`, `Desconforto`). O design do diário é totalmente responsivo, garantindo que o scroll horizontal de filtros e a leitura da linha do tempo sejam perfeitos em qualquer tela.

### 4. Evolução
A área analítica do aplicativo, contendo gráficos visuais e estatísticas ao longo de recortes de tempo configuráveis (7, 30 ou 90 dias). Essencial para que os pais e médicos analisem as tendências de melhora e a evolução do quadro da criança.

## 👥 Arquitetura Multi-Crianças e UX

- **Seletor de Crianças Global**: Localizado no cabeçalho. Ao tocar no avatar e nome (ex: `🧒 Leo ▼`), abre-se um painel intuitivo para alternar a criança ativa ou cadastrar um novo dependente.
- **Isolamento de Estado em Tempo Real**: Ao trocar de criança, o aplicativo é re-renderizado imediatamente (sem recarregar a página). Timeline, Gráficos de Evolução, Resumo do Painel e Consultas filtram estritamente os dados baseados no ID da criança selecionada.
- **Formulário de Cadastro**: Permite registrar o nome da nova criança, data de nascimento, objetivo atual do acompanhamento e data da próxima consulta.
- **Proteção UX (Prevenção de Perda de Dados)**: Se o responsável tentar alterar a criança ativa no meio de um formulário de registro (Wizard) incompleto, o aplicativo pausa o fluxo com um Modal de Advertência escurecido, alertando que os dados em preenchimento podem ser perdidos.

## 💻 Aspectos Técnicos

- **Tecnologias Core**: HTML, CSS (Vanilla) e JavaScript.
- **Design System Customizado**: Todo o CSS foi construído com variáveis (Custom Properties) ricas para esquemas de cores de interface, tags de categorias, e animações polidas. Componentes essenciais (`.bottom-sheet`, `.filter-scroll`, `.timeline`) operam com os padrões mais robustos de flexbox responsivo.
- **State Management**: A aplicação gerencia uma simulação de estado reativo (como um framework moderno) de forma simplificada utilizando um objeto `appState` central, injetando HTML no DOM de forma instantânea sem processamento externo (Nenhuma dependência externa, build tool ou framework foi exigido no protótipo).
- **Prototipagem Mobile-First**: O aplicativo é demonstrado perfeitamente sob uma moldura de `device-simulator` (max-width de 414px) para garantir a integridade da estética de celular na web.

---

*Gerado com base nas especificações do Protótipo Funcional em Evolução Contínua.*
