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
