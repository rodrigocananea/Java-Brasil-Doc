# CNAB 400

::: tip Sobre
O método [preencheBoleto](/boletos/sicredi/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/sicredi/configuracoes)
:::

### Gerar Remessa
```java
BoletoModel boleto = preencheBoleto();

RemessaRetornoModel remessa = new RemessaRetornoModel();
remessa.setBoleto(boleto);
remessa.setNumeroRemessa("1");
remessa.setImpressaoTitulo("2");
remessa.setPostagemTitulo("2");
remessa.setInstrucao("01");

List<RemessaRetornoModel> remessas = Arrays.asList(remessa);

String arquivo = boletoService.gerarArquivoRemessa(remessas);

System.out.println(arquivo);
```

### Importar Retorno
```java
String arquivo = // arquivo de retorno

List<RemessaRetornoModel> retorno = boletoService.importarArquivoRetorno(arquivo);

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