# CNAB 400

::: tip Sobre
O método [preencheBoleto](/boletos/banrisul/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/banrisul/configuracoes)
:::

### Gerar Remessa
```java
BoletoModel boleto = preencheBoleto();

RemessaRetornoModel remessa = new RemessaRetornoModel();
remessa.setBoleto(boleto);
remessa.setNumeroRemessa("10");
remessa.setPostagemTitulo("2");
remessa.setImpressaoTitulo("2");
remessa.setInstrucao("01");
remessa.setJuroDeMora(BigDecimal.TEN);

List<RemessaRetornoModel> remessas = Arrays.asList(remessa);

String arquivo = boletoService.gerarArquivoRemessa(remessas);

System.out.println(arquivo);
```

### Importar Retorno
```java
String arquivo = // arquivo de retorno

List<RemessaRetornoModel> retorno = boletoService.importarArquivoRetorno(arquivo);

```