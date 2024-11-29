# Projeto IT-Electric APP

## Sobre o Projeto
O IT-Electric é um sistema de gerenciamento desenvolvido especificamente para profissionais autônomos do ramo de elétrica. Este sistema facilita o controle de orçamentos, gerenciamento financeiro e de clientes, através de uma interface web moderna e responsiva. O projeto foi desenvolvido como parte do trabalho de conclusão de curso em Engenharia de Software pelo Centro Universitário - Católica de Santa Catarina.

## Objetivo
Este software tem como objetivo desenvolver uma ferramenta que auxilie eletricistas na gestão de seus projetos, proporcionando os seguintes benefícios:
- Aumento da produtividade: Automatização de tarefas repetitivas e redução do tempo gasto na elaboração de orçamentos.
- Melhora na organização: Centralização de informações e fácil acesso aos dados de cada projeto.
- Redução de erros: Padronização de processos e minimização de riscos de erros manuais.
- Satisfação do cliente: Agilidade na entrega de orçamentos e acompanhamento transparente do projeto através de envio de emails.

## Boas práticas de desenvolvimento aplicadas
- O projeto foi desenvolvido com componentes Standalone, garantindo maior independência e modularidade entre os diferentes módulos. Isso proporciona flexibilidade no desenvolvimento e facilita a manutenção a longo prazo.
- Criação de interfaces e models, proporcionando uma estrutura sólida e escalável para a aplicação. O uso dessas abstrações melhora a comunicação entre as partes do sistema e permite um design mais claro e organizado.
- As requisições foram separadas em serviços (services), melhorando a organização do código e facilitando a reutilização. Isso torna a aplicação mais modular e facilita a manutenção e testes.
- Testes unitários implementados utilizando Jest, assegurando a qualidade e confiabilidade do código. Isso reduz o risco de bugs e melhora a robustez do sistema.
- Implementação de interceptores de erros, centralizando o controle de falhas nas requisições. Essa abordagem facilita a gestão eficiente de exceções e melhora a experiência do usuário ao lidar com erros.

Esse é o FRONT-END do projeto, que também conta com um back-end disponíveL no repositório: [BACK-END](https://github.com/DiegoPriess/itelectric-api)

### Dashboard Kanban [Jira](https://diegopriessdev.atlassian.net/jira/software/projects/KAN/boards/1)

## Arquitetura C4
- [NV.1](https://drive.google.com/file/d/1cjtWxbsxG7hVC8DEFkOR6WQd6ZeGkPWz/view?usp=sharing)
- [NV.2](https://drive.google.com/file/d/1IeZX3G9YlAU1yuloMuRd6zc5fc9VUpQw/view?usp=sharing)
- [NV.3](https://drive.google.com/file/d/1vO7s7wQtwONgZgGq_Q49tUo-yFIXrOxQ/view?usp=sharing)
- [NV.4](https://drive.google.com/file/d/1lFf0mzdBJF32mfsSrSgtDDfgtEhdT7fF/view?usp=sharing)

## Requisitos funcionais
| Identificação | Requisito Funcional                                                                 | Descrição                                                                                                                                      |
|---------------|--------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| **RF.1**      | **Gerenciar Trabalhos**                                                              | Permitir o cadastro, edição e exclusão de trabalhos realizados pelos eletricistas.                                                              |
| **RF.2**      | **Gestão de Material**                                                               | Controlar os materiais utilizados nos orçamentos e serviços prestados, incluindo a quantidade e o custo.                                        |
| **RF.3**      | **Gerenciar Orçamento**                                                              | Criar, editar e excluir orçamentos, além de listar orçamentos existentes.                                                                       |
| **RF.4**      | **Aprovação e Negação de Orçamentos**                                                 | Permitir que os eletricistas aprovem ou neguem orçamentos realizados para os clientes.                                                          |
| **RF.5**      | **Login**                                                                            | Sistema de login para os eletricistas e clientes, garantindo segurança no acesso.                                                              |
| **RF.6**      | **Registrar**                                                                         | Permitir o registro de novos usuários (eletricistas e clientes) no sistema.                                                                    |
| **RF.7**      | **Geração de Credenciais para Clientes Cadastrados em Orçamentos**                   | Gerar credenciais de acesso para clientes que tiverem orçamentos cadastrados.                                                                  |
| **RF.8**      | **Envio de E-mail com Credenciais**                                                  | Enviar e-mails automáticos para os clientes com suas credenciais de acesso ao sistema.                                                         |
| **RF.9**      | **Envio de E-mail e Notificação de Novo Orçamento**                                  | Enviar e-mails e notificações aos clientes quando um novo orçamento for registrado ou atualizado.                                              |
| **RF.10**     | **Dashboard de Cliente com Informações de Todos Seus Orçamentos**                    | Fornecer um dashboard para os clientes com informações detalhadas sobre todos os seus orçamentos, mesmo quando realizados por diferentes eletricistas. |

## Requisitos não funcionais
| Identificação | Requisito Não Funcional                                                                | Descrição                                                                                                                              |
|---------------|----------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **RNF.1**     | **Autenticação com Token JWT**                                                         | O sistema deve utilizar autenticação baseada em token JWT para garantir segurança no acesso às funcionalidades.                        |
| **RNF.2**     | **Validação de Credenciais de Usuário**                                                | O sistema deve validar as credenciais de usuários (eletricistas e clientes) para garantir que apenas usuários autenticados acessem o sistema. |
| **RNF.3**     | **Experiência do Usuário**                                                            | O sistema deve oferecer uma experiência de usuário intuitiva e fluida, com interfaces amigáveis e tempos de resposta rápidos.           |
| **RNF.4**     | **Criptografia bcrypt**                                                                | As senhas dos usuários devem ser criptografadas utilizando o algoritmo bcrypt, garantindo a segurança dos dados sensíveis.              |

## Tecnologias Utilizadas
- **Linguagem:** Angular 18
- **Testes:** JEST
- **Deploy:** AWS
- **Qualidade:** [SonarCloud](https://sonarcloud.io/project/overview?id=DiegoPriess_iteletric-app)
- **Monitoramento** [Datadog](https://app.datadoghq.com/dashboard/ivz-3u3-cdk/api?fromUser=false&refresh_mode=sliding&from_ts=1732843123031&to_ts=1732846723031&live=true)

## Contato
- Autor: Diego Priess
  - Email: diegopriess.dev@gmail.com
  - Linkedin: https://www.linkedin.com/in/diego-priess-457aab188/

# Como Rodar o Projeto Locamente

Para rodar o projeto localmente e começar a desenvolver, siga os passos abaixo:

### Pré-requisitos

Antes de começar, você precisa ter as seguintes ferramentas instaladas:

- **Node.js** (versão 14 ou superior)
  - [Baixe e instale o Node.js](https://nodejs.org/)
- **Angular CLI**
  - Você pode instalar o Angular CLI globalmente com o comando:
    ```bash
    npm install -g @angular/cli
    ```

### Passos para Rodar

1. **Clone o repositório**
   ```bash
   git clone https://github.com/DiegoPriess/iteletric-api.git
   cd iteletric-api
   ```

2. **Instale as dependências Execute o comando abaixo para instalar todas as dependências do projeto:**
   ```bash
   npm install
   ```

3. **Configure a API Backend**
   ```bash
   [Backend IT-Electric API](https://github.com/DiegoPriess/itelectric-api).
   ```

4. **Inicie o servidor com o comando:**
   ```bash
   npm start
   ```

5. **Inicie o servidor com o comando:**
   ```bash
   npm start
   ```

6. **Antes de enviar alterações rode os testes unitários com o comando:**
   ```bash
   npm run test
   ```
