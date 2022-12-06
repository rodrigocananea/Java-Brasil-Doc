# API

::: tip Sobre
O método [preencheBoleto](/boletos/banrisul/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/banrisul/configuracoes)
:::

### Envio
```java
BoletoModel boletoModel = preencheBoleto();
boletoModel = boletoService.enviarBoleto(boletoModel);
```

### Alterar
```java
BoletoModel boletoModel = preencheBoleto();
boletoModel = boletoService.alterarBoleto(boletoModel);
```
### Consulta
```java
BoletoModel boletoModel = // ...
boletoModel = boletoService.consultarBoleto(boletoModel);
```
### Baixar
```java
BoletoModel boletoModel = // ...
boletoModel = boletoService.baixarBoleto(boletoModel);
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