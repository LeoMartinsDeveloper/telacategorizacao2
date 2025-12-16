⚡ Introdução Rápida: O Módulo de Classificação

O Módulo de Classificação Manual Assistida (Cockpit HITL) é a interface de alta produtividade para refinar a precisão do nosso sistema de Inteligência Artificial.Construído sobre o conceito Human-in-the-Loop (HITL), este Cockpit foca em apresentar os itens onde a IA teve baixa confiança, permitindo que o operador: Confirme ou corrija a classificação sugerida, altere o nome do produto (normalized_name) e use sugestões de similaridade da IA para agilizar o processo.

🛠️ Tecnologias Usadas

Este projeto Front-End foi desenvolvido com foco em performance e robustez, utilizando uma pilha moderna e tipada. A estrutura de aplicação e o roteamento são gerenciados pelo Next.js (App Router). O React é a biblioteca principal para a construção dos componentes da interface do usuário (UI), como as colunas e o editor. Para garantir a segurança e a tipagem estrita de dados críticos (como IDs e payloads), utilizamos o TypeScript. Por fim, o Tailwind CSS é empregado para a estilização rápida e flexível do layout de 3 colunas.

Atenção: A regra de negócio principal (Imutabilidade do ID, Concorrência e Persistência) é delegada e garantida pelas Stored Functions no Backend/DB.

<img width="1919" height="904" alt="image" src="https://github.com/user-attachments/assets/4ffe6fdd-0e12-4e7e-a9ab-aca65202be1d" />


<img width="1918" height="897" alt="image" src="https://github.com/user-attachments/assets/a9afb467-4ecd-4870-8833-204f87d036ee" />

