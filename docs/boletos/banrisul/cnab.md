# CNAB 240

::: warning AVISO!
O método [preencheBoleto](/boletos/banrisul/preenchimento) deve ser utilizado conforme 
na pagina lida anteriormente junto a inicialização do [boletoService](/boletos/banrisul/configuracoes)
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

::: tip Preguiça!
Ainda estou implementando o resto da documentação, se estiver vendo isso subi o código sem atualizar o resto
:::