# CNAB 240

::: tip Sobre
O método [preencheBoleto](/boletos/sicoob/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/sicoob/configuracoes)
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
StringBuilder arquivo = new StringBuilder();

for (String linha : Files.readAllLines(Paths.get("d:/teste/sicoobretorno.ret"))) {
    arquivo.append(linha).append(System.lineSeparator());
}

List<RemessaRetornoModel> remessaRetornoModels = boletoService.importarArquivoRetorno(arquivo.toString());

System.out.println(remessaRetornoModels);
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

### Imprimir em conjunto
```java
BoletoModel boleto1 = preencheBoleto();
BoletoModel boleto2 = preencheBoleto();

byte[] bytes1 = boletoService.imprimirBoletoJasper(boleto1);
byte[] bytes2 = boletoService.imprimirBoletoJasper(boleto2);

byte[] bytesUnidos = JasperUtil.unirRelatorio(Arrays.asList(bytes1, bytes2));

Files.write(Paths.get("d:/teste/teste.pdf"), bytesUnidos);
```