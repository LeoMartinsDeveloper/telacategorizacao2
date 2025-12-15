⚡ Introdução Rápida: O Módulo de Classificação

O Módulo de Classificação Manual Assistida (Cockpit HITL) é a interface de alta produtividade para refinar a precisão do nosso sistema de Inteligência Artificial.Construído sobre o conceito Human-in-the-Loop (HITL), este Cockpit foca em apresentar os itens onde a IA teve baixa confiança, permitindo que o operador: Valide: Confirme ou corrija a classificação sugerida. Edite: Altere o nome do produto (normalized_name). Decida: Use sugestões de similaridade da IA para agilizar o processo.

🛠️ Tecnologias Usadas

Este projeto Front-End foi desenvolvido com foco em performance e robustez, utilizando uma pilha moderna e tipada. A estrutura de aplicação e o roteamento são gerenciados pelo Next.js (App Router). O React é a biblioteca principal para a construção dos componentes da interface do usuário (UI), como as colunas e o editor. Para garantir a segurança e a tipagem estrita de dados críticos (como IDs e payloads), utilizamos o TypeScript. Por fim, o Tailwind CSS é empregado para a estilização rápida e flexível do layout de 3 colunas.

Atenção: A regra de negócio principal (Imutabilidade do ID, Concorrência e Persistência) é delegada e garantida pelas Stored Functions no Backend/DB.

<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/30487c10-4ccd-4f6a-9c6c-7358e845c15c" />

<img width="1320" height="771" alt="image" src="https://github.com/user-attachments/assets/f12d5697-6de0-4a8f-8829-43ef86fa6693" />
