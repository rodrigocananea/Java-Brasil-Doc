# Java NFe

***Biblioteca Java para consumo do WebService de NFe/NFCe***

<Badge type="tip" text="v4.3.0" /> <Badge type="info" text="Schemas PL 010g v1.03" /> <Badge type="info" text="Java 8+" />

## Dúvidas, Sugestões ou Consultoria
[![Java Brasil](https://discordapp.com/api/guilds/519583346066587676/widget.png?style=banner2)](https://discord.gg/ZXpqnaV)

## Gostou do Projeto? Dê sua colaboração pelo Pix: 01713390108 
<p align="center">
    <img src="https://swconsultoria.com.br/pix.png" width="220">
</p>

## Para Iniciar

- Baixe o [schemas.zip](https://github.com/Samuel-Oliveira/Java_NFe/raw/master/schemas.zip) e extraia na sua máquina. O caminho da pasta é informado nas [Configurações](./configuracoes.md).

::: warning Atenção
Os Schemas mudam a cada Nota Técnica. **Sempre que atualizar a versão da biblioteca, baixe o `schemas.zip` novamente**, principalmente se você usa a validação do XML.
:::

- External Jar: baixe e adicione às bibliotecas do seu projeto em [Releases](https://github.com/Samuel-Oliveira/Java_NFe/releases).

- Maven :
```xml
<dependency>
    <groupId>br.com.swconsultoria</groupId>
    <artifactId>java-nfe</artifactId>
    <version>4.3.0</version>
</dependency>
```

- Gradle :
```groovy
repositories {
    mavenCentral()
}
dependencies {
    implementation "br.com.swconsultoria:java-nfe:4.3.0"
}
```

::: tip Impressão (DANFE)
As bibliotecas de impressão (JasperReports, Thymeleaf, openhtmltopdf, barbecue e zxing) são `provided`: não vêm por transitividade. Declare-as no seu projeto somente se for usar a [Impressão](./impressao.md).
:::

## Atualizando de v4.00.x para v4.1.* ou superior?

A partir da v4.1.* os ~48 sub-packages JAXB foram **consolidados em apenas 2** (`schemas` e `schemas_eventos`) e várias classes de evento foram renomeadas. Imports antigos como `schema_4.enviNFe.*`, `schema.envEventoCancNFe.*` ou `schema.evento112110.DetEvento` **não compilam mais**.

Veja o guia completo em [Migração v4.00 → v4.1](./migracao.md).

## Novidades recentes

### v4.3.0 - Schemas PL 010g
- **DANFE v2** da NF-e (modelo 55) no leiaute da NT 2026.010 (Reforma Tributária: IBS/CBS/IS), gerado com Thymeleaf + openhtmltopdf. Veja [DANFE v2](./impressao-danfe-v2.md).
- Schemas atualizados para o **PL 010g v1.03**:
  - NT 2026.006 (Vinculação de Pagamento): grupo `gPgtoVinc` e evento **110300** (`DetEvento110300`).
  - NT 2026.008 (Valor Líquido): campos `vUnComLiq`, `vProdLiq`, `vProdLiqTot` e grupo `ICMSPrevistoPagtoAntecip`.
- **Quebra de compilação:** `TTribNFCe` perdeu `getGIBSCBSMono()`/`setGIBSCBSMono()` (removido pelo PL 010g).
- Correção do marshalling de eventos sem `@XmlRootElement` (evento genérico).

### v4.2.0 - Schemas PL 010f
- Novo modelo de monofásicos (NT 2025.002 v1.50) e melhorias no `IbsCbsUtil`.

### v4.1.x - Schemas PL 010d/010e
- Consolidação dos packages JAXB (`schemas` + `schemas_eventos`).
- Eventos da Reforma Tributária gerados como classes `DetEvento<código>`.
- **BREAKING:** `TProtNFe.InfProt.getDhRecbto()` passou a retornar `String`.

O histórico completo está no [README do projeto](https://github.com/Samuel-Oliveira/Java_NFe#historico-de-vers%C3%B5es).

## Funcionalidades

| Serviço | Página |
|---|---|
| Status do serviço | [Status Serviço Sefaz](./status-servico.md) |
| Consulta situação / protocolo | [Consulta Situação](./consulta-situacao.md) |
| Envio NF-e / NFC-e (síncrono e assíncrono) | [Envio](./envio.md) |
| Cancelamento e Cancelamento por Substituição | [Cancelamento](./cancelamento.md) |
| Carta de Correção | [CC-e](./cce.md) |
| Inutilização | [Inutilização](./inutilizacao.md) |
| Manifestação do Destinatário | [Manifestação](./manifestacao.md) |
| Distribuição DF-e | [Baixar Documento](./baixar-documento.md) |
| Consulta Cadastro | [Consulta Cadastro](./consulta-cadastro.md) |
| EPEC | [Envio EPEC](./envio-epec.md) |
| Conciliação Financeira (ECONF) | [ECONF](./econf.md) |
| IBS / CBS (Reforma Tributária) | [Reforma Tributária](./reforma-tributaria.md) |
| Eventos da Reforma Tributária | [Evento Genérico](./evento-generico.md) |
| Impressão DANFE / DANFCE / CC-e | [Impressão](./impressao.md) |
