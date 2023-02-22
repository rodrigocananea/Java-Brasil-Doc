# Ler XML

Função para realizar a leitura do XML, mais em especifico é um exemplo de como ler os impostos do documento.

::: warning Aviso
Caso obtenha um erro relacionado ao encode **BOM** você pode encontrar 
uma [forma de remover ele do arquivo](#remove-bom-encode) antes de realizar a leitura/importação do xml.
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

### Leitura de impostos
Para realizar a leitura de impostos será necessário utilizar estes **imports**
```java
// Importações realizadas
import br.com.swconsultoria.nfe.schema_4.enviNFe.TIpi;
import br.com.swconsultoria.nfe.schema_4.enviNFe.TNFe.InfNFe.Det;
import br.com.swconsultoria.nfe.schema_4.enviNFe.TNFe.InfNFe.Det.Imposto.ICMS;
import br.com.swconsultoria.nfe.schema_4.enviNFe.TNFe.InfNFe.Emit;
import br.com.swconsultoria.nfe.schema_4.enviNFe.TNfeProc;
import br.com.swconsultoria.nfe.util.XmlNfeUtil;
```

Depois de feita a conversão de Xml para Objeto você pode acessar o element **Det** que é onde está os produtos do seu documento
```java
// Listando informações de produtos 'det'
for (Det det : nfe.getNFe().getInfNFe().getDet()) {
    // ...
```

### 1° forma para ler os impostos
```java
for (JAXBElement<?> e : det.getImposto().getContent()) {
  if (e.getValue() instanceof TIpi) {
    TIpi ipi = (TIpi) e.getValue();
    // ...
  }

  if (e.getValue() instanceof ICMS) {
    ICMS icms = (ICMS) e.getValue();
    // ...
  }

  if (e.getValue() instanceof PIS) {
    PIS pis = (PIS) e.getValue();
    // ...
  }

  if (e.getValue() instanceof COFINS) {
    COFINS cofins = (COFINS) e.getValue();
    // ...
  }

  if (e.getValue() instanceof PISST) {
    PISST pisst = (PISST) e.getValue();
    // ...
  }

  if (e.getValue() instanceof COFINSST) {
    COFINSST cofinsst = (COFINSST) e.getValue();
    // ...
  }

}
```

### 2° forma para ler os impostos
```java
Iterator iter = det.getImposto().getContent().iterator();
if (iter.hasNext()) {
    while (iter.hasNext()) {
        JAXBElement<JAXBElement> elementIter = (JAXBElement) iter.next();
        switch (elementIter.getName().getLocalPart()) {
            case "ICMS":
                JAXBElement<TNFe.InfNFe.Det.Imposto.ICMS> iterICMS = (JAXBElement) elementIter;
                icmsNota = iterICMS.getValue();
                break;
            case "PIS":
                JAXBElement<TNFe.InfNFe.Det.Imposto.PIS> iterPIS = (JAXBElement) elementIter;
                pisNota = iterPIS.getValue();
                break;
            case "PISST":
                JAXBElement<TNFe.InfNFe.Det.Imposto.PISST> iterPISST = (JAXBElement) elementIter;
                pisStNota = iterPISST.getValue();
                break;
            case "COFINS":
                JAXBElement<TNFe.InfNFe.Det.Imposto.COFINS> iterCOFINS = (JAXBElement) elementIter;
                cofinsNota = iterCOFINS.getValue();
                break;
            case "COFINSST":
                JAXBElement<TNFe.InfNFe.Det.Imposto.COFINSST> iterCOFINSST = (JAXBElement) elementIter;
                cofinsStNota = iterCOFINSST.getValue();
                break;
            case "IPI":
                JAXBElement<TIpi> elementIPI = (JAXBElement) elementIter;
                ipiNota = elementIPI.getValue();
                break;
            default:
                break;
        }
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
