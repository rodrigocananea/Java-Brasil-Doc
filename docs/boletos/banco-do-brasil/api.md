# API

::: tip Sobre
O método [preencheBoleto](/boletos/banco-do-brasil/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/banco-do-brasil/configuracoes)
:::

### Envio
```java
BoletoModel boletoModel = preencheBoleto();
BoletoModel retorno = boletoService.enviarBoleto(boletoModel);
System.out.println(retorno.getCodRetorno() + " - " + retorno.getMensagemRetorno());
System.out.println(retorno.getCodigoBarras());
```

### Consulta
```java
BoletoModel boletoModel = // boletoModel com nossoNumero e numeroConvenio preenchidos
BoletoModel retorno = boletoService.consultarBoleto(boletoModel);
System.out.println(retorno.getCodRetorno() + " - " + retorno.getMensagemRetorno());
System.out.println(retorno.getCodigoBarras());
```

### Alterar / Consultar / Baixar
::: tip Sobre
Estes métodos ainda estão em desenvolvimento
:::

### Imprimir
::: danger Aviso
O banco não permite essas operações via API, assim será utilizada impressão com informações locais.
:::
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

