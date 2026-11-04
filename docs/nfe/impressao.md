# Impressão (DANFE, DANFCE e CC-e)

Desde a v4.00.41 a impressão faz parte do próprio Java_NFe (pacote `br.com.swconsultoria.nfe.impressao`), sem precisar do projeto Java_Danfe.

Há duas engines no mesmo jar:

| | v1 — Jasper (`ImpressaoNfeUtil`) | v2 — Thymeleaf (`ImpressaoDanfeV2Util`) |
|---|---|---|
| Documentos | NF-e, NFC-e e CC-e | **Somente NF-e (modelo 55)** |
| Leiaute | DANFE tradicional | NT 2026.010 (IBS/CBS/IS), produção a partir de 01/12/2026 |
| Saídas | PDF (arquivo/byte[]), HTML, preview, impressão direta | PDF (arquivo/byte[]), HTML, impressão direta |

Esta página cobre a **v1 (Jasper)**. Para o novo DANFE da Reforma Tributária, veja [DANFE v2](./impressao-danfe-v2.md).

## Dependências

As bibliotecas de impressão são `provided`: **não vêm por transitividade** e precisam ser declaradas no seu projeto.

```xml
<dependency>
    <groupId>net.sf.jasperreports</groupId>
    <artifactId>jasperreports</artifactId>
    <version>6.20.6</version>
</dependency>
<dependency>
    <groupId>net.sf.jasperreports</groupId>
    <artifactId>jasperreports-fonts</artifactId>
    <version>6.20.6</version>
</dependency>
<!-- código de barras e QR Code -->
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

::: tip Localização
Para garantir a moeda em reais e o formato de data brasileiro, independente do locale da máquina:
```java
JRPropertiesUtil.getInstance(DefaultJasperReportsContext.getInstance())
        .setProperty("net.sf.jasperreports.default.locale", "pt_BR");
```
:::

## DANFE NF-e
```java
import br.com.swconsultoria.nfe.impressao.ImpressaoDTO;
import br.com.swconsultoria.nfe.impressao.ImpressaoNfeUtil;
import br.com.swconsultoria.nfe.util.XmlNfeUtil;

public class TesteImpressaoNFe {

    public static void main(String[] args) {
        try {
            //Faça a leitura do Arquivo
            String xml = XmlNfeUtil.leXml("d:/teste/nfe.xml");

            //Layout Padrão
            ImpressaoDTO impressao = ImpressaoNfeUtil.impressaoPadraoNFe(xml);

            //Faz a impressão em pdf File
            ImpressaoNfeUtil.impressaoPdfArquivo(impressao, "d:/teste/teste-nfe.pdf");
        } catch (Exception e) {
            //Trate seus erros aqui
            e.printStackTrace();
        }
    }
}
```

## DANFCE (NFC-e)
```java
String xml = XmlNfeUtil.leXml("d:/teste/nfce.xml");

//Informe a Url de Consulta da NFC-e do seu Estado
String urlConsulta = "www.sefaznet.ac.gov.br/nfce/consulta";
ImpressaoDTO impressao = ImpressaoNfeUtil.impressaoPadraoNFCe(xml, urlConsulta);

ImpressaoNfeUtil.impressaoPdfArquivo(impressao, "d:/teste/teste-nfce.pdf");
```

::: tip
A URL de consulta pode ser obtida da própria biblioteca: `WebServiceUtil.getUrl(config, DocumentoEnum.NFCE, ServicosEnum.URL_CONSULTANFCE)`.
:::

## Carta de Correção (CC-e)
```java
String xml = XmlNfeUtil.leXml("d:/teste/cce.xml");   // procEventoNFe da CC-e

ImpressaoDTO impressao = ImpressaoNfeUtil.impressaoPadraoCCe(xml);
ImpressaoNfeUtil.impressaoPdfArquivo(impressao, "d:/teste/teste-cce.pdf");
```

## Formas de saída

```java
// PDF em arquivo
ImpressaoNfeUtil.impressaoPdfArquivo(impressao, "d:/teste/danfe.pdf");

// PDF em memória
byte[] pdf = ImpressaoNfeUtil.impressaoPdfByte(impressao);

// HTML em arquivo
ImpressaoNfeUtil.impressaoHtml(impressao, "d:/teste/danfe.html");

// Preview (janela do JasperViewer)
JasperViewer viewer = ImpressaoNfeUtil.impressaoPreview(impressao);
viewer.setVisible(true);

// Impressão direta: impressora padrão, impressora específica e/ou configuração do exporter
ImpressaoNfeUtil.impressaoDireta(impressao);
ImpressaoNfeUtil.impressaoDireta(impressao, printService);
ImpressaoNfeUtil.impressaoDireta(impressao, printService, simplePrintServiceExporterConfiguration);

// JasperPrint, para manipular o relatório antes de exportar
JasperPrint jasperPrint = ImpressaoNfeUtil.geraImpressao(impressao);
```

## Layout próprio e logo
```java
ImpressaoDTO impressao = ImpressaoNfeUtil.impressaoPadraoNFe(xml);

//Informe qualquer .jasper (do classpath)
impressao.setJasper(ImpressaoNfeUtil.carregaJasperResources("/danfe-modificado.jasper"));

//Para trocar a Logo
impressao.getParametros().put("Logo", MinhaClasse.class.getResourceAsStream("/logo.png"));

byte[] bytes = ImpressaoNfeUtil.impressaoPdfByte(impressao);
```

Exemplos no repositório: [pasta impressao](https://github.com/Samuel-Oliveira/Java_NFe/tree/master/src/test/java/br/com/swconsultoria/nfe/impressao).
