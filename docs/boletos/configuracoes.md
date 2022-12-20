# Configurações Exemplo

Aqui será apresentado as configurações básicas que deve ter conhecimento para uso da biblioteca.

## Uso de API/CNAB
Para uso de qualquer boleto por API ou CNAB deve ser instanciado a configuração (referente ao banco de uso) inicial a ser utilizada, mesmo que não precise passar nenhum parâmetro para ela.

```java
ConfiguracaoExemplo configuracao = new ConfiguracaoExemplo();
configuracao.setUsuario("teste");
configuracao.setSenha("123");

BoletoService boletoService = new BoletoService(BoletoBanco.EXEMPLO, configuracao);
```

## Métodos Adicionais


### Imprimir
```java
BoletoModel boletoModel = preencheBoleto();

// Retorno em byte array
byte[] boletoImprimir = boletoService.imprimirBoletoJasper(boletoModel);

// Ou
// Imprimir com jasper 
boolean imprimirDireto = false;
PrintService impressoraUtilizada = // impressora padrão ou selecionada

// Caso o imprimirDireto seja false será aberto na 
// tela um jasperViewer com o PDF dentro
boletoService.imprimirBoletoJasperDesktop(boletoModel, imprimirDireto, impressoraPadrao);
```

### Imprimir em conjunto
```java
BoletoModel boleto1 = preencheBoleto();
BoletoModel boleto2 = preencheBoleto();

byte[] bytes1 = boletoService.imprimirBoletoJasper(boleto1);
byte[] bytes2 = boletoService.imprimirBoletoJasper(boleto2);

byte[] bytesUnidos = JasperUtil.unirRelatorio(Arrays.asList(bytes1, bytes2));

Files.write(Paths.get("d:/teste/teste.pdf"), bytesUnidos);
```
