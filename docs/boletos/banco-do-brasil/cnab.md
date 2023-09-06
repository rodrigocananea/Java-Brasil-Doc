# CNAB 400

::: tip Sobre
O método [preencheBoleto](/boletos/banco-do-brasil/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/banco-do-brasil/configuracoes)
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
