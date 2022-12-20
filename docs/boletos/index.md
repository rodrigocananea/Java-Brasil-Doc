<script setup>
import Releases from '../components/Releases.vue'    
</script>


# Java Boletos
***Projeto para geração de boletos dos bancos criado e mantido pela comunidade JavaBrasil***

::: warning AVISO!
Para ter o acesso a esta biblioteca deve entrar em contato pelo [Discord](https://discord.gg/ZXpqnaV) da Java Brasil
:::

## Dúvidas, Sugestões ou Consultoria
[![Java Brasil](https://discordapp.com/api/guilds/519583346066587676/widget.png?style=banner2)](https://discord.gg/ZXpqnaV)

## Boletos/Bancos Desenvolvidos
| **Banco / Entidade** | **Tipo** | **Envio** | **Alteração** | **Consulta** | **Baixa** | **Impressão** |
| -------------------- | :------: | :-------: | :-----------: | :----------: | :-------: | :-----------: |
| Banco do Brasil      |   API    |     ✅     |       🕐       |      🕐       |     🕐     |       🕐       |
| Banco do Brasil CNAB | CNAB 240 |     ✅     |       ✅       |      ✅       |     ✅     |       ✅       |
| BanriSul             |   API    |     ✅     |       ✅       |      ✅       |     ✅     |       ✅       |
| BanriSul CNAB        | CNAB 240 |     ✅     |       ✅       |      ✅       |     ✅     |       ✅       |
| Bradesco             |   API    |     ✅     |       ❌       |      ❌       |     ❌     |       🕐       |
| Bradesco CNAB        | CNAB 400 |     ✅     |       ✅       |      ✅       |     ✅     |       ✅       |
| Itaú                 |   API    |     ✅     |       ❌       |      ❌       |     ❌     |       🕐       |
| Safe2Pay             |   API    |     ✅     |       ✅       |      ✅       |     ✅     |       ✅       |
| Sicoob               |   API    |     ✅     |       🕐       |      ✅       |     🕐     |       ✅       |
| Sicoob               | CNAB 240 |     ✅     |       ✅       |      ✅       |     ✅     |       ✅       |
| Sicred               | CNAB 400 |     ✅     |       ✅       |      ✅       |     ✅     |       ✅       |

- ✅ : Pronto
- 🕐 : Em Desenvolvimento
- ❌ : Banco não Disponibiliza Função 

________________________________________________________________________________________________


# Historico de Versões

## v1.0.7 - 08/12/2022
- Correções Bradesco CNAB400
- Adicionado Merge de boletos

## v1.0.6 - 24/10/2022
- Correções Bradesco CNAB400

## v1.0.5 - 02/09/2022
- Correções Bradesco CNAB
- Implementado Banrisul CNAB 240
- Implementado Banco do Brasil CNAB 240

## v1.0.4 - 14/08/2022
- Atualização Versao Jasper
- Implementado Bradesco CNAB 400

## v1.0.3 - 02/08/2022
- Correção de digito linha Digitável Sicoob CNAB 240

## v1.0.2 - 07/07/2022
- Correção de layout de Sicoob CNAB 240
- Adicionado Alteração, Baixa e Consulta do Safe2Pay

## v1.0.1 - 28/06/2022
- Adicionado Itaú
- Adicionado Safe2Pay
- Correção de layout de Sicoob CNAB 240

## v1.0.0 - 11/06/2022 
- Versão Inicial
- Adicionado Bradesco API
- Adicionado Sicoob API
- Adicionado Banrisul API
- Adicionado Sicoob CNAB 240
- Adicionado Sicred CNAB 400