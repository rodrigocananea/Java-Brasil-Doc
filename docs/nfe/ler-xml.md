# Ler XML

Exemplos de como ler um XML de NF-e/NFC-e autorizado (`nfeProc`) e acessar seus dados, em especial os impostos dos itens.

::: warning Aviso
Caso obtenha um erro relacionado ao encode **BOM**, veja [como removê-lo](#remove-bom-encode) antes de realizar a leitura/importação do XML.
:::

### XML para String
```java
// removeBom(Paths.get(caminhoArquivoXml));
String xml = XmlNfeUtil.leXml(caminhoArquivoXml);
```

### XML String para Objeto TNfeProc
```java
TNfeProc nfe = XmlNfeUtil.xmlToObject(xml, TNfeProc.class);
```

O mesmo vale para outros documentos, por exemplo `TEnviNFe`, `TRetConsSitNFe`, `TProcEventoCancelamento`, `TProcEventoCartaCorrecao`...

### Imports
Desde a v4.1 todas as classes do leiaute ficam em `br.com.swconsultoria.nfe.schemas` (e os eventos em `br.com.swconsultoria.nfe.schemas_eventos`):
```java
import br.com.swconsultoria.nfe.schemas.TIpi;
import br.com.swconsultoria.nfe.schemas.TNfeProc;
import br.com.swconsultoria.nfe.schemas.TTribNFe;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto.COFINS;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto.COFINSST;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto.ICMS;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto.PIS;
import br.com.swconsultoria.nfe.schemas.TNFe.InfNFe.Det.Imposto.PISST;
import br.com.swconsultoria.nfe.util.XmlNfeUtil;
```

Depois de feita a conversão de XML para Objeto você pode acessar o elemento **Det**, que é onde estão os produtos do documento:
```java
for (Det det : nfe.getNFe().getInfNFe().getDet()) {
    // ...
}
```

### Valores dos impostos com `XmlImpostoUtil`

A forma mais simples de obter os valores é o `XmlImpostoUtil`, que percorre o `getContent()` do imposto e devolve `BigDecimal` (zero quando o imposto não existe no item):

```java
import br.com.swconsultoria.nfe.util.XmlImpostoUtil;

List<JAXBElement<?>> impostos = det.getImposto().getContent();

BigDecimal vICMS   = XmlImpostoUtil.getVICMS(impostos);
BigDecimal vFCP    = XmlImpostoUtil.getVFCP(impostos);
BigDecimal vPIS    = XmlImpostoUtil.getVPIS(impostos);
BigDecimal vCOFINS = XmlImpostoUtil.getVCOFINS(impostos);
BigDecimal vICMSMono = XmlImpostoUtil.getVICMSMono(impostos);
BigDecimal vICMSUFDest = XmlImpostoUtil.getVICMSUFDest(impostos);
BigDecimal vFCPUFDest  = XmlImpostoUtil.getVFCPUFDest(impostos);
BigDecimal vISSQN  = XmlImpostoUtil.getVISSQN(impostos);
BigDecimal vII     = XmlImpostoUtil.getVII(impostos);
BigDecimal vIS     = XmlImpostoUtil.getVIS(impostos);   // Imposto Seletivo
```

### Lendo os grupos de impostos manualmente
```java
for (JAXBElement<?> e : det.getImposto().getContent()) {
    Object valor = e.getValue();

    if (valor instanceof ICMS) {
        ICMS icms = (ICMS) valor;
        // icms.getICMS00(), icms.getICMS60(), icms.getICMSSN102() ...
    } else if (valor instanceof TIpi) {
        TIpi ipi = (TIpi) valor;
    } else if (valor instanceof PIS) {
        PIS pis = (PIS) valor;
    } else if (valor instanceof COFINS) {
        COFINS cofins = (COFINS) valor;
    } else if (valor instanceof PISST) {
        PISST pisst = (PISST) valor;
    } else if (valor instanceof COFINSST) {
        COFINSST cofinsst = (COFINSST) valor;
    } else if (valor instanceof TTribNFe) {
        // Grupo IBSCBS da Reforma Tributária
        TTribNFe ibsCbs = (TTribNFe) valor;
        String cst = ibsCbs.getCST();
        String cClassTrib = ibsCbs.getCClassTrib();
        // ibsCbs.getGIBSCBS(), ibsCbs.getGIBSCBSMono(), ibsCbs.getGTransfCred() ...
    }
}
```

Também é possível identificar o grupo pelo nome da tag:
```java
for (JAXBElement<?> e : det.getImposto().getContent()) {
    switch (e.getName().getLocalPart()) {
        case "ICMS":     ICMS icms = (ICMS) e.getValue(); break;
        case "IPI":      TIpi ipi = (TIpi) e.getValue(); break;
        case "PIS":      PIS pis = (PIS) e.getValue(); break;
        case "PISST":    PISST pisSt = (PISST) e.getValue(); break;
        case "COFINS":   COFINS cofins = (COFINS) e.getValue(); break;
        case "COFINSST": COFINSST cofinsSt = (COFINSST) e.getValue(); break;
        case "IBSCBS":   TTribNFe ibsCbs = (TTribNFe) e.getValue(); break;
        default: break;
    }
}
```

### Remove BOM Encode
```java
// Remove BOM caso seja encontrado no arquivo
public static void removeBom(Path path) throws IOException {
    if (isContainBOM(path)) {
        byte[] bytes = Files.readAllBytes(path);
        ByteBuffer bb = ByteBuffer.wrap(bytes);
        byte[] bom = new byte[3];
        // get the first 3 bytes
        bb.get(bom, 0, bom.length);
        // remaining
        byte[] contentAfterFirst3Bytes = new byte[bytes.length - 3];
        bb.get(contentAfterFirst3Bytes, 0, contentAfterFirst3Bytes.length);
        // override the same path
        Files.write(path, contentAfterFirst3Bytes);
    }
}

// Verifica se no arquivo contém BOM para ser removido
private static boolean isContainBOM(Path path) throws IOException {
    if (Files.notExists(path)) {
        throw new IllegalArgumentException("Arquivo: " + path + " não encontrado!");
    }
    boolean result = false;
    byte[] bom = new byte[3];
    try (InputStream is = new FileInputStream(path.toFile())) {
        // read 3 bytes of a file.
        is.read(bom);
        // BOM encoded as ef bb bf
        String content = new String(Hex.encodeHex(bom));
        if ("efbbbf".equalsIgnoreCase(content)) {
            result = true;
        }
    }
    return result;
}
```
