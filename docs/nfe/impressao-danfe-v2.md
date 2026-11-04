# DANFE v2 (Reforma Tributária) <Badge type="tip" text="v4.3.0" />

Novo DANFE da **NF-e modelo 55** no leiaute da **NT 2026.010 — DANFE Reforma Tributária (IBS/CBS/IS)**, que entra em produção em **01/12/2026**. É gerado com Thymeleaf (HTML/CSS) e convertido em PDF pelo openhtmltopdf, no pacote `br.com.swconsultoria.nfe.impressao.v2`.

A v1 (Jasper) continua no mesmo jar: **NFC-e e CC-e continuam na v1**. Veja [Impressão](./impressao.md).

## Dependências

As bibliotecas de impressão são `provided` no `java-nfe` e precisam ser declaradas no seu projeto:

```xml
<dependency>
    <groupId>br.com.swconsultoria</groupId>
    <artifactId>java-nfe</artifactId>
    <version>4.3.0</version>
</dependency>
<dependency>
    <groupId>org.thymeleaf</groupId>
    <artifactId>thymeleaf</artifactId>
    <version>3.1.2.RELEASE</version>
</dependency>
<dependency>
    <groupId>com.openhtmltopdf</groupId>
    <artifactId>openhtmltopdf-pdfbox</artifactId>
    <version>1.0.10</version>
</dependency>
<!-- código de barras e QR Code: as mesmas da v1 -->
<dependency>
    <groupId>net.sourceforge.barbecue</groupId>
    <artifactId>barbecue</artifactId>
    <version>1.5-beta1</version>
</dependency>
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.2.1</version>
</dependency>
<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>javase</artifactId>
    <version>3.2.1</version>
</dependency>
```

::: warning Conflitos de versão
- **Spring Boot 2.x** traz Thymeleaf 3.0.x; a v2 precisa da **3.1.x**. Force a `3.1.2.RELEASE` no `dependencyManagement`. (Spring Boot 3.x já usa a 3.1.)
- **PDFBox 3.x** é incompatível com o openhtmltopdf 1.0.10, que usa a 2.0.x.
- Um `NoClassDefFoundError` de `org.thymeleaf`, `com.openhtmltopdf`, `net.sourceforge.barbecue` ou `com.google.zxing` indica dependência `provided` não declarada.
:::

## Uso básico

```java
import br.com.swconsultoria.nfe.impressao.v2.ImpressaoDanfeV2DTO;
import br.com.swconsultoria.nfe.impressao.v2.ImpressaoDanfeV2Util;
import br.com.swconsultoria.nfe.util.XmlNfeUtil;

public class TesteImpressaoDanfeV2 {

    public static void main(String[] args) {
        //XML autorizado (nfeProc) ou NFe sem protocolo
        String xml = XmlNfeUtil.leXml("d:/teste/nfe.xml");

        //Layout padrão: logo padrão, orientação pelo tpImp, com canhoto
        ImpressaoDanfeV2DTO impressao = ImpressaoDanfeV2Util.impressaoPadraoNFe(xml);

        ImpressaoDanfeV2Util.impressaoPdfArquivo(impressao, "d:/teste/danfe.pdf");   // PDF em arquivo
        byte[] pdf  = ImpressaoDanfeV2Util.impressaoPdfByte(impressao);               // PDF em memória
        ImpressaoDanfeV2Util.impressaoHtml(impressao, "d:/teste/danfe.html");          // HTML em arquivo
        String html = ImpressaoDanfeV2Util.gerarHtml(impressao);                       // HTML em String
        ImpressaoDanfeV2Util.impressaoDireta(impressao);                               // impressora padrão
        ImpressaoDanfeV2Util.impressaoDireta(impressao, printService);                 // impressora específica
    }
}
```

- **XML aceito:** `nfeProc` (com `protNFe`) ou `NFe` sem protocolo — neste caso a chave vem do `infNFe/@Id` e o protocolo sai em branco.
- **Erros:** tudo lança `br.com.swconsultoria.nfe.exception.DanfeException` (unchecked): XML vazio/malformado, XML sem `infNFe`, template inválido, falha ao gravar o arquivo, impressora não encontrada.
- **Thread-safety:** `ImpressaoDanfeV2Util` é stateless; crie um `ImpressaoDanfeV2DTO` por impressão.

## Personalização

```java
ImpressaoDanfeV2DTO impressao = ImpressaoDanfeV2Util.impressaoPadraoNFe(xml);

// Logo (PNG, JPEG, GIF ou BMP; SVG não é suportado)
impressao.setLogo(inputStream);                  // lê e fecha o stream
impressao.setLogo(bytes);
impressao.setLogoArquivo("c:/logos/empresa.png");
impressao.removerLogo();                         // sem logo

// Orientação: AUTOMATICA (padrão, usa ide/tpImp: 2 = paisagem), RETRATO ou PAISAGEM
impressao.setOrientacao(OrientacaoDanfeEnum.PAISAGEM);

// Canhoto (a NT permite suprimir)
impressao.setExibirCanhoto(false);

// Parâmetros livres, disponíveis no template como ${parametros.nome}
impressao.getParametros().put(ImpressaoDanfeV2Util.PARAM_TIPO_REGIME_APURACAO, "...");

// Template Thymeleaf próprio
impressao.setTemplate("c:/templates/meu-danfe.html");
```

::: danger Segurança
`setTemplate` e `setLogoArquivo` abrem o arquivo informado onde ele estiver. Esses caminhos são **configuração do servidor, nunca entrada do usuário final**.
:::

### Template próprio

Copie o template padrão do jar (`danfe/v2/danfe.html` e `fragmentos.html`) e altere. Variáveis disponíveis:

| Variável | Uso |
|---|---|
| `danfe` | Dados da nota (`DanfeV2DTO`): `danfe.ide`, `danfe.emit`, `danfe.icmsTot`, `danfe.ibsCbsTot`, `danfe.itens`... |
| `fmt` | Formatação: `${fmt.valor(danfe.icmsTot.vNF)}`, `fmt.documento`, `fmt.chave`, `fmt.cst(orig, cst)`... |
| `xml` | Qualquer campo via XPath: `${xml.valor('//infNFe/ide/tpEmis')}` |
| `logo`, `codigoBarras`, `qrCode` | Imagens em data URI |
| `paisagem`, `exibirCanhoto` | Configuração resolvida |
| `parametros` | `getParametros()` |

Regras principais do openhtmltopdf: XHTML bem formado (`<br />`, sem `&nbsp;`), CSS 2.1 + paged media (sem flexbox/grid; use `<table>`), e não concatene códigos numéricos com `+` no Thymeleaf (use os métodos do `fmt`).

## Migração v1 → v2 (somente NF-e)

| v1 (Jasper) | v2 |
|---|---|
| `ImpressaoNfeUtil.impressaoPadraoNFe(xml)` | `ImpressaoDanfeV2Util.impressaoPadraoNFe(xml)` |
| `ImpressaoNfeUtil.impressaoPdfArquivo / impressaoPdfByte / impressaoHtml / impressaoDireta` | mesmos nomes em `ImpressaoDanfeV2Util` |
| `ImpressaoNfeUtil.impressaoPreview(impressao)` | **Não existe**: gere o PDF e abra num visualizador |
| `impressaoDireta(..., SimplePrintServiceExporterConfiguration)` | **Não existe**: gere o PDF e imprima com PDFBox/`PrinterJob` |
| `impressao.getParametros().put("Logo", inputStream)` | `impressao.setLogo(inputStream)` |
| `impressao.setJasper(meuJasper)` | `impressao.setTemplate("meu-danfe.html")` |
| `throws JRException, IOException...` | `DanfeException` (unchecked) |

Recomendação: deixe a escolha entre v1 e v2 configurável (feature flag) durante a transição.

## O que o leiaute imprime

- Quadros na ordem da NT: canhoto, emitente (com CRT e "Tipo de Regime de Apuração do IBS e da CBS"), destinatário, fatura, totais, ICMS/IPI, **Total do IBS/CBS/IS**, ISSQN, transporte, produtos e dados adicionais com QR Code.
- Colunas dos itens com **bases, alíquotas e valores** de ICMS, IBS/CBS, IS e IPI, para os quatro formatos do grupo `IBSCBS` (`gIBSCBS`, monofásico ad rem/ad valorem, transferência de crédito e ajuste de competência).
- Com `gRed` imprime a **alíquota efetiva** (`pAliqEfet`).
- Quadros facultativos só aparecem quando existem no XML; notas sem `IBSCBSTot` não mostram o quadro de IBS/CBS/IS.
- Folhas 2+ repetem emitente e cabeçalho dos itens; homologação (`tpAmb=2`) recebe a marca "SEM VALOR FISCAL".

## Limitações conhecidas

- Sem tarjas de contingência (`tpEmis` ≠ 1) nem de nota cancelada/denegada — faça num template próprio se precisar.
- Só o primeiro `transp/vol` é impresso; DANFE simplificado (`tpImp=3`) cai no retrato.
- Impressão direta não foi testada em impressora real.
- Desempenho: ~2 s na primeira geração da JVM; depois 100–300 ms para notas pequenas.

O manual completo, com o modelo de dados e testes de aceitação, está em [MANUAL-DANFE-V2.md](https://github.com/Samuel-Oliveira/Java_NFe/blob/master/docs/MANUAL-DANFE-V2.md).
