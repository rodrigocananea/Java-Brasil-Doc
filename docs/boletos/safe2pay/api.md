# API

::: tip Sobre
O método [preencheBoleto](/boletos/safe2pay/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/safe2pay/configuracoes)
:::

### Envio
```java
BoletoModel boletoModel = preencheBoleto();
BoletoModel boletoResponse = boletoService.enviarBoleto(boletoModel);

System.out.println("Numero Boleto : " + boletoResponse.getNumeroBoleto());
System.out.println("Data Boleto : " + boletoResponse.getDataVencimento());
System.out.println("Situação Boleto : " + boletoResponse.getSituacao());
System.out.println("Url Boleto : " + boletoResponse.getUrlPdf());
```
### Alterar
```java
BoletoModel boletoModel = new BoletoModel();
boletoModel.setNumeroBoleto(numeroBoleto);
boletoModel.setDataVencimento(dataVencimento);
BoletoModel boletoResponse = boletoService.alterarBoleto(boletoModel);

System.out.println("Numero Boleto : " + boletoResponse.getNumeroBoleto());
System.out.println("Data Boleto : " + boletoResponse.getDataVencimento());
System.out.println("Situação Boleto : " + boletoResponse.getSituacao());
System.out.println("Url Boleto : " + boletoResponse.getUrlPdf());
```
### Consulta
```java
BoletoModel boletoModel = new BoletoModel();
boletoModel.setNumeroBoleto(numeroBoleto);
BoletoModel boletoResponse = boletoService.consultarBoleto(boletoModel);

System.out.println("Numero Boleto : " + boletoResponse.getNumeroBoleto());
System.out.println("Data Boleto : " + boletoResponse.getDataVencimento());
System.out.println("Situação Boleto : " + boletoResponse.getSituacao());
System.out.println("Url Boleto : " + boletoResponse.getUrlPdf());
```
### Baixar
```java
BoletoModel boletoModel = new BoletoModel();
boletoModel.setNumeroBoleto(numeroBoleto);
BoletoModel boletoResponse = boletoService.baixarBoleto(boletoModel);

System.out.println("Numero Boleto : " + boletoResponse.getNumeroBoleto());
System.out.println("Data Boleto : " + boletoResponse.getDataVencimento());
System.out.println("Situação Boleto : " + boletoResponse.getSituacao());
System.out.println("Url Boleto : " + boletoResponse.getUrlPdf());
```
### Imprimir
```java
BoletoModel boletoModel = preencheBoleto();

// Retorno em byte array
byte[] boletoImprimir = boletoService.imprimirBoletoJasper(boletoModel);
FileUtils.writeByteArrayToFile(new File("/safe2pay/boleto-safe2pay-" + boletoResponse.getCodigoBarras() + ".pdf"), boletoImprimir);

// Ou
// Imprimir com jasper 
boolean imprimirDireto = false;
PrintService impressoraUtilizada = // impressora padrão ou selecionada

// Caso o imprimirDireto seja false será aberto na 
// tela um jasperViewer com o PDF dentro
boletoService.imprimirBoletoJasperDesktop(boletoModel, imprimirDireto, impressoraPadrao);
```