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

### Alterar / Consultar / Baixar / Imprimir
::: danger Aviso
O banco não permite essas operações via API
:::