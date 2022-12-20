# API

::: tip Sobre
O método [preencheBoleto](/boletos/sicoob/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/sicoob/configuracoes)
:::

### Envio
```java
BoletoModel boletoModel = preencheBoleto();
boletoModel = boletoService.enviarBoleto(boletoModel);
```
### Consulta
```java
BoletoModel boletoModel = new BoletoModel();
boletoModel.setCodigoBarras("12345678901234567890123456789012345678901234");
boletoModel.setLinhaDigitavel("12345678901234567890123456789012345678901234567");
BoletoModel boletoModelRetorno = boletoService.consultarBoleto(boletoModel);

System.out.println(boletoModelRetorno.getSituacao());
```
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
### Alterar / Baixar
::: warning INFO
Ainda está sendo implementado este método.
:::