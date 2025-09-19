# Fuel Navigator

## Visão do Projeto
O objetivo desse app é fornecer aos usuários informações precisas sobre o consumo, estimado de combustível em seus trajetos, assim como o gasto previsto de acordo com o valor informado do combustível, somado à gestão de dados pessoais e de veículos.

### Requisitos Funcionais <a name="requisitos"><a>

| RF | Nome | Descritivo |
|:--:|:----:|:----------:|
|RF1 | Cadastro e Autenticação de Usuários.| O software precisa conter um CRUD de usuários, permitindo o cadastro, edição, listagem e remoção dos respectivos dados.|
|RF2 | Gerenciamento de Veiculos | O software precisa conter um CRUD de veículos, permitindo o cadastro, edição, listagem e remoção dos respectivos dados.|
|RF3 | Navegação e rotas | O software deve conter a funcionalidade de busca por rotas, sendo possível salvar rotas e utiliza-las offline, sendo informado o consumo de gasolina com base na distância.|
|RF4 | Histórico e relatórios | É necessário conter um histórico de rotas procuradas recentemente, como também a geração de relatórios semanais/mensais sobre consumo.|
|RF5 | Notificações e alertas | Devem ser emitidos avisos e alertas baseados em condições anormais de consumo.|
|RF6 | Persistência e offline | A aplicação deve oferecer um backup local ou em núvem, para que os dados não sejam perdidos.|
|RF7 | Interface | O software deve ter uma interface fácil e acessivel, contendo a possibilidade de temas claros e escuros.|

### Requisitos Não Funcionais

| RFN | Nome |
|:--:|:----:|
|RNF1 | Segurança de dados com criptografia básica. |
|RNF2 | Boas práticas de armazenamento de credenciais.|
|RNF3 | Interface responsiva, clara e acessível. |
|RNF4 | Atualizações em tempo real das estimativas. |
|RNF5 | Suporte a funcionamento básico offline |
|RNF6 | Exportação eficiente de relatórios em PDF. | 
|RNF7 | Usabilidade com experiência de usuário simples/intuitiva. | 
|RNF8 | Compatibilidade Android |
|RNF9 |Desempenho aceitável | 





---


## 📜 Product Backlog <a name="backlog"><a>

| RANK | SPRINT | PRIORIDADE | ESTIMATIVA | USER STORY (NOME)                                             | STATUS |
|:----:|:------:|:----------:|:----------:|:-------------------------------------------------------------:|:------:|
| 1    |   1   |    Alta     |     5      | Como Cliente, quero um CRUD para os usuários, para gerenciamento de suas informações.|        |
| 2    |   1   |    Alta     |     3      | Como Usuário, quero um CRUD para o gerenciamento de veiculos, para gerenciamento de suas informações.|        |
| 3    |   1   |    Alta     |     5      | Como Usuário, quero uma tela de navegação de mostre as rotas selecionadas, para que eu possa utilizar como navegador.|        |
| 4    |   1   |    Alta     |    5       | Como Usuário, quero que seja possível o calculo de consumo de gasolina com base no veiculo selecionado, para melhor visualização dos dados.|        |
| 5   |   1   |   Alta      |     8      | Como Usuário, quero processar e armazenar automaticamente os dados recebidos por meio um banco de dados em nuvem, para que os dados não sejam perdidos ou dependam do dispositivo.|        |
| 6   |   1   |  Alta   |      8     | Como Usuário, quero que seja possível armazenar em um historico as rotas anteriormente buscadas, para que eu possa acompanhar de maneira acertiva.|        |
| 7   |   2   |   Alta     |      3     | Como Usuário, quero que o sistema tenha a opção de salvar as rotas utilizadas, para facilitação de busca.|        |
| 8    |  2   |    Média      |     5      | Como Usuário, quero que seja possível a geração de relatórios que informe o consumo e a distância percorrida ao longo do mês.|        |
| 9    |   3   |    Média    |      8     | Como Usuário, quero o software possua uma interface simples e prática, para que eu possar navegar sem dificuldades.|        |
| 10    |   3   |    Média     |    3       | Como Cliente, quero que o software possua autenticação para o login de usuários, para que possa haver maior segurança em relação a aplicação.|        |




---
